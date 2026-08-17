import axiosClient from './axiosClient'

export const inventoryApi = {
  get: (productId) => {
    return axiosClient.get(`/inventory/${productId}`)
  },

  updateStock: (productId, data) => {
    return axiosClient.put(`/inventory/${productId}/stock`, data)
  },
}
