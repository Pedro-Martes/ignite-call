import NextAuth from 'next-auth'

declare module 'next-auth' {
  export interface User {
    id: string
    username: string
    name: string
    email: string
    avatar_Url: string
  }

  interface Session {
    user: User
  }
}
