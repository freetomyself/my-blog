// 增强搜索功能
// 支持：模糊查询、精确查询（引号）、系列筛选按钮、多条件筛选

const resList = document.getElementById('searchResults');
const sInput = document.getElementById('searchInput');
const searchBox = document.getElementById('searchbox');

let fuse;
let searchIndex = [];
let currentElement = null;
let firstResult = null;
let lastResult = null;
let activeSeriesFilter = ''; // 当前选中的系列筛选

// Fuse.js 配置
const fuseOptions = {
    distance: 100,
    threshold: 0.4,
    ignoreLocation: true,
    includeMatches: true,
    keys: [
        { name: 'title', weight: 0.4 },
        { name: 'summary', weight: 0.3 },
        { name: 'content', weight: 0.2 },
        { name: 'tags', weight: 0.05 },
        { name: 'categories', weight: 0.05 }
    ]
};

// 解析搜索查询（支持输入框中的条件语法）
const parseQuery = (query) => {
    const filters = {
        category: null,
        tag: null,
        series: null,
        year: null
    };
    let keywords = query;

    // 解析分类筛选
    const categoryMatch = keywords.match(/(?:分类|category)[:：](\S+)/i);
    if (categoryMatch) {
        filters.category = categoryMatch[1];
        keywords = keywords.replace(categoryMatch[0], '').trim();
    }

    // 解析标签筛选
    const tagMatch = keywords.match(/(?:标签|tag)[:：](\S+)/i);
    if (tagMatch) {
        filters.tag = tagMatch[1];
        keywords = keywords.replace(tagMatch[0], '').trim();
    }

    // 解析系列筛选
    const seriesMatch = keywords.match(/(?:系列|series)[:：](\S+)/i);
    if (seriesMatch) {
        filters.series = seriesMatch[1];
        keywords = keywords.replace(seriesMatch[0], '').trim();
    }

    // 解析年份
    const yearMatch = keywords.match(/\b(20\d{2})\b/);
    if (yearMatch) {
        filters.year = yearMatch[1];
        keywords = keywords.replace(yearMatch[0], '').trim();
    }

    return { keywords, filters };
};

// 应用筛选条件
const applyFilters = (items, filters) => {
    return items.filter(item => {
        if (filters.category) {
            const cats = Array.isArray(item.categories) ? item.categories : [item.categories];
            if (!cats.some(c => c && c.toLowerCase().includes(filters.category.toLowerCase()))) {
                return false;
            }
        }
        if (filters.tag) {
            const tags = Array.isArray(item.tags) ? item.tags : [item.tags];
            if (!tags.some(t => t && t.toLowerCase().includes(filters.tag.toLowerCase()))) {
                return false;
            }
        }
        if (filters.series) {
            const series = Array.isArray(item.series) ? item.series : (item.series ? [item.series] : []);
            if (!series.some(s => s && s.toLowerCase().includes(filters.series.toLowerCase()))) {
                return false;
            }
        }
        if (filters.year) {
            const date = item.date || '';
            if (!date.includes(filters.year)) {
                return false;
            }
        }
        return true;
    });
};

// 防抖
const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => fn(...args), delay);
    };
};

// 重置
const reset = () => {
    currentElement = null;
    firstResult = null;
    lastResult = null;
    resList.innerHTML = '';
    sInput.value = '';
    sInput.focus();
};

// 设置焦点结果
const setActiveResult = (element) => {
    document.querySelectorAll('.focus').forEach((item) => item.classList.remove('focus'));
    if (!element) return;
    element.focus();
    element.parentElement?.classList.add('focus');
    currentElement = element;
};

// 高亮文本
const highlightText = (text, keywords) => {
    if (!keywords || !text) return text;
    const escaped = keywords.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
};

// 渲染结果
const renderResults = (results, keywords) => {
    if (!Array.isArray(results) || results.length === 0) {
        resList.innerHTML = '<li class="no-results">未找到匹配结果</li>';
        firstResult = lastResult = currentElement = null;
        return;
    }

    const fragment = document.createDocumentFragment();

    for (const result of results) {
        const item = result.item || result;
        const li = document.createElement('li');

        const titleDiv = document.createElement('div');
        titleDiv.className = 'search-result-title';
        titleDiv.innerHTML = highlightText(item.title, keywords);

        const metaDiv = document.createElement('div');
        metaDiv.className = 'search-result-meta';
        const parts = [];
        if (item.date) parts.push(item.date.substring(0, 10));
        if (item.categories) {
            const cats = Array.isArray(item.categories) ? item.categories : [item.categories];
            parts.push(cats.join(', '));
        }
        if (item.series) {
            const series = Array.isArray(item.series) ? item.series : [item.series];
            parts.push('系列: ' + series.join(', '));
        }
        metaDiv.textContent = parts.join(' · ');

        if (item.summary) {
            const summaryDiv = document.createElement('div');
            summaryDiv.className = 'search-result-summary';
            summaryDiv.innerHTML = highlightText(item.summary.substring(0, 100) + '...', keywords);
            li.appendChild(summaryDiv);
        }

        const link = document.createElement('a');
        link.className = 'entry-link';
        link.href = item.permalink;
        link.setAttribute('aria-label', item.title);

        li.insertBefore(titleDiv, li.firstChild);
        li.insertBefore(metaDiv, titleDiv.nextSibling);
        li.appendChild(link);
        fragment.appendChild(li);
    }

    resList.innerHTML = '';
    resList.appendChild(fragment);
    firstResult = resList.firstElementChild;
    lastResult = resList.lastElementChild;
};

// 执行搜索
const performSearch = () => {
    if (!fuse || !searchIndex) return;

    const rawQuery = sInput.value.trim();
    const hasSeriesFilter = activeSeriesFilter !== '';

    // 如果没有搜索词且没有系列筛选，清空结果
    if (!rawQuery && !hasSeriesFilter) {
        resList.innerHTML = '';
        return;
    }

    let results = [];
    let keywords = rawQuery;

    if (hasSeriesFilter) {
        // 有系列筛选按钮激活
        const filters = { series: activeSeriesFilter };

        if (rawQuery) {
            // 有搜索词 + 系列筛选
            const parsed = parseQuery(rawQuery);
            keywords = parsed.keywords;
            // 合并输入框中的其他筛选条件
            if (parsed.filters.category) filters.category = parsed.filters.category;
            if (parsed.filters.tag) filters.tag = parsed.filters.tag;
            if (parsed.filters.year) filters.year = parsed.filters.year;
            // 输入框的系列筛选覆盖按钮
            if (parsed.filters.series) filters.series = parsed.filters.series;
        }

        let filtered = applyFilters(searchIndex, filters);

        if (keywords) {
            const tempFuse = new Fuse(filtered, fuseOptions);
            results = tempFuse.search(keywords);
        } else {
            // 仅筛选，无关键词
            results = filtered.map(item => ({ item }));
        }
    } else if (rawQuery) {
        // 仅关键词搜索（支持输入框中的条件语法）
        const { keywords: kw, filters } = parseQuery(rawQuery);
        keywords = kw;
        const hasInputFilters = filters.category || filters.tag || filters.series || filters.year;

        if (hasInputFilters) {
            let filtered = applyFilters(searchIndex, filters);
            if (keywords) {
                const tempFuse = new Fuse(filtered, fuseOptions);
                results = tempFuse.search(keywords);
            } else {
                results = filtered.map(item => ({ item }));
            }
        } else {
            results = fuse.search(keywords);
        }
    }

    renderResults(results, keywords);
};

// 初始化系列筛选按钮
const initFilterButtons = () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新激活状态
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 更新筛选值
            activeSeriesFilter = btn.dataset.series || '';

            // 重新搜索
            performSearch();
        });
    });
};

// 初始化搜索
const initSearch = async () => {
    if (!sInput || !resList) return;

    sInput.disabled = false;
    sInput.focus();

    // 初始化筛选按钮
    initFilterButtons();

    try {
        const response = await fetch('../index.json');
        if (!response.ok) {
            throw new Error(`Search index load failed: ${response.status}`);
        }

        searchIndex = await response.json();
        if (searchIndex) {
            fuse = new Fuse(searchIndex, fuseOptions);
        }
    } catch (error) {
        console.error(error);
    }
};

window.addEventListener('load', initSearch);

sInput?.addEventListener('input', debounce(performSearch, 200));

sInput?.addEventListener('search', () => {
    if (!sInput.value && !activeSeriesFilter) reset();
});

document.addEventListener('keydown', (event) => {
    const { key } = event;
    const active = document.activeElement;
    const isInSearchBox = searchBox?.contains(active);

    if (key === 'Escape') {
        reset();
        return;
    }

    if (!firstResult || !isInSearchBox) return;

    if (key === 'ArrowDown') {
        event.preventDefault();
        if (active === sInput) {
            setActiveResult(firstResult.querySelector('.entry-link'));
        } else if (active?.parentElement !== lastResult) {
            setActiveResult(active?.parentElement?.nextElementSibling?.querySelector('.entry-link'));
        }
    } else if (key === 'ArrowUp') {
        event.preventDefault();
        if (active?.parentElement === firstResult) {
            setActiveResult(sInput);
        } else if (active !== sInput) {
            setActiveResult(active?.parentElement?.previousElementSibling?.querySelector('.entry-link'));
        }
    } else if (key === 'ArrowRight') {
        if (active?.matches?.('.entry-link')) {
            active.click();
        }
    }
});
