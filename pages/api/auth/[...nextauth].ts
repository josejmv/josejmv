// main tools
import CredentialsProvider from 'next-auth/providers/credentials'
import NextAuth from 'next-auth'

export default NextAuth({
  pages: { error: '/' }, // custom error page with query string as ?error=
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        username: { type: 'string' },
        password: { type: 'string' }
      },

      /**
       * verify if the email is found in 8base as josejmvasquez@gmail.com
       */
      async authorize (credentials) {
        if (
          credentials?.username === process.env.NEXT_PUBLIC_USERNAME &&
          credentials?.password === process.env.NEXT_PUBLIC_PASSWORD
        ) {
          return {
            id: '1',
            url: process.env.NEXT_PUBLIC_ADMIN!,
            secret: process.env.NEXT_PUBLIC_SECRET_REDIRECTION!
          }
        } else throw new Error('Usuario o contraseña incorrectos')
      }
    })
  ],

  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.sub = user.id
        token.url = user.url
        token.secret = user.secret
      }

      return Promise.resolve(token)
    },

    session: async ({ session, token }) => {
      session.redirection = token

      return Promise.resolve({ ...session })
    }
  }
})
