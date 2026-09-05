import rawWaifus from '../data/red_waifus.json';

function queryClientFallback({ page = 1, limit = 20, origin = '', search = '' } = {}) {
  let filtered = rawWaifus;
  const cleanOrigin = (origin || '').trim().toLowerCase();
  const cleanSearch = (search || '').trim().toLowerCase();

  if (cleanOrigin && cleanOrigin !== 'all') {
    filtered = filtered.filter((item) => (item.origin || '').toLowerCase() === cleanOrigin);
  }

  if (cleanSearch) {
    filtered = filtered.filter(
      (item) =>
        (item.name || '').toLowerCase().includes(cleanSearch) ||
        (item.series || '').toLowerCase().includes(cleanSearch)
    );
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const items = filtered.slice(startIndex, endIndex);
  const hasNextPage = page < totalPages;

  return {
    items,
    total,
    page,
    limit,
    totalPages,
    hasNextPage,
  };
}

export async function fetchWaifus({ page = 1, limit = 20, origin = '', search = '' } = {}) {
  try {
    const params = new URLSearchParams();
    if (page) params.append('page', String(page));
    if (limit) params.append('limit', String(limit));
    if (origin && origin !== 'all') params.append('origin', origin);
    if (search) params.append('search', search);

    const response = await fetch(`/api/waifus?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      items: data.items || [],
      total: data.total ?? 0,
      page: data.page ?? page,
      limit: data.limit ?? limit,
      totalPages: data.totalPages ?? 0,
      hasNextPage: !!data.hasNextPage,
    };
  } catch (error) {
    console.warn('Falling back to local dataset query:', error.message);
    return queryClientFallback({ page, limit, origin, search });
  }
}

export async function fetchRedWaifus(count = 100) {
  const result = await fetchWaifus({ page: 1, limit: count });
  return result.items;
}