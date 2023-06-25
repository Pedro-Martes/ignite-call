// eslint-disable-next-line no-unused-vars
import NextAuth from 'next-auth'

declare module 'next-auth' {
  export interface User {
    id: string
    username: string
    name: string
    email: string
    avatar_Url: string
  }

  // eslint-disable-next-line no-unused-vars
  interface Session {
    user: User
  }
}
