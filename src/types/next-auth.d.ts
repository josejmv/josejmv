// eslint-disable-next-line
import NextAuth from 'next-auth'

declare module 'next-auth' {
  export interface User {
    url: string
    secret: string
  }
  export interface Session {
    redirection: {
      url: string
      secret: string
    }
  }
}

declare module 'next-auth/jwt' {
  export interface JWT {
    url: string
    secret: string
  }
}
