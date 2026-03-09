const API_BASE = import.meta.env.VITE_API_URL || '';

function normalizeSort(sort) {
  const value = String(sort || '').trim();
  if (!value) return '';

  if (value === 'regularPrice' || value === 'price_asc') return 'price_asc';
  if (value === '-regularPrice' || value === 'price_desc') return 'price_desc';
  if (value === 'newest') return '-createdAt';
  if (value === '-createdAt' || value === 'createdAt' || value === 'relevance' || value === 'views' || value === '-rating') {
    return value;
  }

  return value;
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || 'API Error');
    err.response = data;
    throw err;
  }
  return data;
}

export default {
  getProducts: async (params = {}) => {
    // build query
    const q = new URLSearchParams();
    const searchTerm = params.search || params.q || params.keyword;
    if (searchTerm) {
      q.set('search', searchTerm);
    }
    if (params.category && params.category !== 'all') q.set('category', params.category);
    if (params.subCategory && params.subCategory !== 'all') q.set('subCategory', params.subCategory);
    if (params.type) q.set('type', params.type);
    if (typeof params.offer !== 'undefined') q.set('offer', String(params.offer));
    
    // Convert pagination parameters
    if (params.limit) q.set('pageSize', params.limit);
    if (typeof params.startIndex !== 'undefined') {
      const pageSize = params.limit || 12;
      const pageNumber = Math.floor(params.startIndex / pageSize) + 1;
      q.set('pageNumber', pageNumber);
    }
    if (params.page) q.set('pageNumber', params.page);
    
    const normalizedSort = normalizeSort(params.sort);
    if (normalizedSort) q.set('sort', normalizedSort);
    if (params.order) q.set('order', params.order);

    // include any agriculture filters
    if (params.filters) {
      Object.entries(params.filters).forEach(([k, v]) => {
        if (v !== null && typeof v !== 'undefined') q.set(k, v);
      });
    }

    const url = `/api/products?${q.toString()}`;
    return request(url);
  },
  getProduct: async (id) => request(`/api/products/${id}`),
  uploadImages: async (formData, token) => {
    const res = await fetch(`${API_BASE}/api/products/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token || ''}`,
      },
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload failed');
    return data;
  },
};
