import { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import Users from '@/models/User';
import bcrypt from 'bcrypt';
import connect from '@/lib/mongoose';


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'E-mail address',
          type: 'email',
          placeholder: 'jsmith@jsmith.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials, req) {
        await connect();
        if (!credentials?.email || !credentials?.password) {
        return null;
        }
        

    
          
          const user = await Users.findOne({email:credentials.email});
          if(user==null){
            return null;
          }
          const match = await bcrypt.compare(credentials.password, user.password);


          if (!match){
            return null;
          }


        return { _id: user._id.toString()} as User;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user._id = token._id;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth/signin',
  
  }
};