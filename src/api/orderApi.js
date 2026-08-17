import axiosClient from './axiosClient'

export const orderApi = {
  create: (data) => {
    return axiosClient.post('/orders', data)
  },

  get: (id) => {
    return axiosClient.get(`/orders/${id}`)
  },

  listByCustomer: (customerId) => {
    return axiosClient.get('/orders', { params: { customerId } })
  },

  getStatus: (id) => {
    return axiosClient.get(`/orders/${id}/status`)
  },

  cancel: (id) => {
    return axiosClient.put(`/orders/${id}/cancel`)
  },
}
