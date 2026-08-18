import axiosClient from './axiosClient'

export const customerApi = {
  listAll: () => {
    return axiosClient.get('/customers')
  },

  searchByEmail: async (email) => {
    if (!email || email.trim() === '') {
      return customerApi.listAll()
    }

    try {
      const response = await axiosClient.get(`/customers/email/${email}`)
      return {
        ...response,
        data: normalizeCustomersResponse(response),
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        return { data: [] }
      }
      throw error
    }
  },

  list: (email = '') => {
    return customerApi.searchByEmail(email)
  },

  get: (id) => {
    return axiosClient.get(`/customers/${id}`)
  },

  create: (data) => {
    return axiosClient.post('/customers', data)
  },

  update: (id, data) => {
    return axiosClient.put(`/customers/${id}`, data)
  },

  updateStatus: (id, status) => {
    return axiosClient.patch(`/customers/${id}/status`, null, {
      params: { status },
    })
  },

  delete: (id) => {
    return axiosClient.delete(`/customers/${id}`)
  },
}

// Helper to normalize response to array format
export const normalizeCustomersResponse = (response) => {
  const data = response.data

  // If data is already an array, return it
  if (Array.isArray(data)) {
    return data
  }

  // If data is a single object with customer properties, wrap it in array
  if (data && typeof data === 'object' && data.id) {
    return [data]
  }

  // If data has a 'data' property that's an array, return that
  if (data && Array.isArray(data.data)) {
    return data.data
  }

  // Fallback to empty array
  return []
}
