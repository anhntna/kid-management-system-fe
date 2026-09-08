const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(url, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const response = await fetch(`${API_BASE}${url}`, config);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: `Request failed with status ${response.status}` };
    }
    throw errorData;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const api = {
  // Children
  getChildren: () => request('/children'),
  getChild: (id) => request(`/children/${id}`),
  createChild: (data) => request('/children', { method: 'POST', body: JSON.stringify(data) }),
  updateChild: (id, data) => request(`/children/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteChild: (id) => request(`/children/${id}`, { method: 'DELETE' }),

  // Moments
  getMoments: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.childId) searchParams.append('childId', params.childId);
    if (params.category) searchParams.append('category', params.category);
    if (params.favorite !== undefined && params.favorite !== null) searchParams.append('favorite', params.favorite);
    if (params.search) searchParams.append('search', params.search);
    const qs = searchParams.toString();
    return request(`/moments${qs ? '?' + qs : ''}`);
  },
  getMoment: (id) => request(`/moments/${id}`),
  createMoment: (data) => request('/moments', { method: 'POST', body: JSON.stringify(data) }),
  updateMoment: (id, data) => request(`/moments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleFavorite: (id) => request(`/moments/${id}/favorite`, { method: 'PATCH' }),
  deleteMoment: (id) => request(`/moments/${id}`, { method: 'DELETE' }),

  // Timeline
  getTimeline: (childId) => request(childId ? `/timeline/${childId}` : '/timeline'),

  // Media Upload
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/media/upload', {
      method: 'POST',
      body: formData,
    });
  },

  uploadMultipleFiles: async (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    return request('/media/upload-multiple', {
      method: 'POST',
      body: formData,
    });
  },
};
