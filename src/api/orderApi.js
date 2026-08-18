import axiosClient from './axiosClient'

export const orderApi = {
  create: (data) => {
    return axiosClient.post('/orders', data)
  },

  get: (id) => {
    return axiosClient.get(`/orders/${id}`)
  },

  list: (customerId = null) => {
    const params = customerId ? { customerId } : {}
    return axiosClient.get('/orders', { params })
  },

  listByCustomer: (customerId) => {
    return orderApi.list(customerId)
  },

  getStatus: (id) => {
    return axiosClient.get(`/orders/${id}/status`)
  },

  cancel: (id) => {
    return axiosClient.put(`/orders/${id}/cancel`)
  },
}
