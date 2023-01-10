/* eslint-disable @typescript-eslint/ban-ts-comment */
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import type { NextAuthOptions } from 'next-auth';

const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {
        email: {
          label: 'Username',
          type: 'text',
          placeholder: 'email@gmail.com',
        },
        password: { label: 'Password', type: 'text' },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        // request to api to login user

        try {
          const tokenApi = await fetch('http://localhost:3001/auth/login', {
            method: 'POST',
            body: JSON.stringify({
              email: email,
              password: password,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (tokenApi.status != 401) {
            const token = await tokenApi.json();
            if (token.access_token) {
              return Promise.resolve({
                id: '12345',
                token: token.access_token,
                email: email,
                password: password,
              });
            }
          }
        } catch (e) {
          console.error(e);
          return Promise.reject(e);
        }

        return Promise.reject();
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    jwt(params) {
      // update token
      if (params.account) {
        params.token.name = params.user?.name;
      }

      if (params.user) {
        //@ts-ignore
        params.token.password = params.user?.password;
        //@ts-ignore
        params.token.token = params.user?.token;
      }
      // return res
      return params.token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.

      //@ts-ignore
      session.user.password = token.password;
      //@ts-ignore
      session.user.token = token.token;
      return session;
    },
  },
};

export default NextAuth(authOptions);
