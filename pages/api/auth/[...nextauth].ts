import {PrismaAdapter} from '@next-auth/prisma-adapter';
import NextAuth, {AuthOptions} from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/app/libs/prismadb';
import bcrypt from "bcrypt";


export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: {label: 'email', type: 'text'},
                password: {label: 'password', type: 'password'},
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }

                // Search for a User with Email typed in by User
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                // Throw Error if user couldn't be found our there is now Password
                if (!user || !user?.hashedPassword) {
                    throw new Error('Invalid credentials');
                }

                // Check password which User typed in and stored in DB
                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                )

                // If password is not correct throw error
                if(!isCorrectPassword) {
                    throw new Error('Invalid credentials');
                }

                // Return User if all checks have passed
                return user;
            },
        })
    ],
    pages: {
        signIn: '/', // Redirect if error or weird callback to route page
    },
    debug: process.env.NODE_ENV === 'development', // Only enable in developemnt 
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions)