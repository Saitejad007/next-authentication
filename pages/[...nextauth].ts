
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { string } from 'yup';

export type credentials = {

}

export default NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: 'email',
          type: 'email',
          placeholder: 'jsmith@example.com',
        },
        password: { label: 'Password', type: 'password' },
        pin: {label: 'Pin', type: 'number'}
      },
      async authorize(credentials, req) {
        const payload = {
          email: credentials?.email,
          password: credentials?.password,
          pin: credentials?.pin
        };

        const res = await fetch('https://dev.api.visnetai.co/api/v1/auth/login', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(res)


        const user = await res.json();
        if (!res.ok) {
          throw new Error(user.message);
        }
        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
    // ...add more providers here
  ],
//   secret: process.env.JWT_SECRET,
//   pages: {
//     signIn: '/login',
//   },
  callbacks: {
    async jwt({ token, account }) {
      if (account ) {
        if (account) {
            token.accessToken = account.vnet_access_key
        }
        return token
      }

      return token;
    },

    async session({ session, user, token }) {
        return session
    },
  },
  theme: {
    colorScheme: 'auto', // "auto" | "dark" | "light"
    brandColor: '', // Hex color code #33FF5D
    logo: '/logo.png', // Absolute URL to image
  },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === 'development',
});