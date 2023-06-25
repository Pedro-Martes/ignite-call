import axios from 'axios'

export const myapi = axios.create({
  baseURL: '/api',
})
