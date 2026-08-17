import axiosClient from './axiosClient'

export const notificationApi = {
  get: (id) => {
    return axiosClient.get(`/notifications/${id}`)
  },

  listByCustomer: (customerId) => {
    return axiosClient.get('/notifications', { params: { customerId } })
  },

  listAll: () => {
    return axiosClient.get('/notifications/all')
  },

  markAsRead: (id) => {
    return axiosClient.put(`/notifications/${id}/read`)
  },

  markAllAsRead: (customerId) => {
    return axiosClient.put('/notifications/read-all', { customerId })
  },
}
