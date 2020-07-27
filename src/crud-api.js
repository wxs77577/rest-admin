import Vue from 'vue'

const request = Vue.prototype.$axios

export default {
  async getSettings() {
    const res = await request.get(`/settings`)
    return res.data
  },
  async getConfig(resource, query = {}) {
    const res = await request.get(`${resource}/config`, {
      params: {
        query: JSON.stringify(query)
      }
    })
    return res.data
  },
  async find(resource, query = {}) {
    const res = await request.get(resource, {
      params: {
        query: JSON.stringify(query)
      }
    })
    return res.data
  },
  async findOne(resource, id, query = {}) {
    const res = await request.get(`${resource}/${id}`, {
      params: {
        query: JSON.stringify(query)
      }
    })
    return res.data
  },
  async create(resource, data) {
    const res = await request.post(resource, data)
    return res.data
  },
  async update(resource, id, data) {
    const res = await request.put(`${resource}/${id}`, data)
    return res.data
  },
  async delete(resource, id) {
    await request.put(`${resource}/${id}`, data)
    return true
  }
}