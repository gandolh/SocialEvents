import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/pages/api/auth/MongoDBClient";
import axios from "axios";
import { SocialEventsUser } from "@/types/SocialEventsUser";
const backendURL = process.env.BACKEND_URL;


declare module "next-auth" {

  interface Session {
    user:  SocialEventsUser
  }

  interface User {
    name: string
    email: string
    isAdmin: boolean
    department: string
  } 
}

export  const nextAuthConfig : NextAuthOptions= {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      }),
      CredentialsProvider({
        type: "credentials",
        credentials: {
            email: { label: "Email", type: "email", placeholder: "Your e-mail here" },
            password: { label: "Password", type: "password", placeholder: "Your password here" }
        },
    
        async authorize(credentials) {
          const credentialDetails = {
            email: credentials?.email,
            password: credentials?.password,
          };
          try{
            const resp = await axios.post(backendURL + "/User", credentialDetails);
            const {user, message } = await resp.data;
            return user;
          
          }
          catch(error){
            console.log("User not found." + error);
          }
        }
    })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt'
    },
    jwt: {
      secret: process.env.NEXTAUTH_SECRET,
    },
    pages: {
      signIn: '/api/auth/login',
      signOut: '/api/auth/signout',
      // error: '/en/login', // Error code passed in query string as ?error=
      // verifyRequest: '/auth/verify-request', // (used for check email message)
      // newUser: '/api/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    theme: {
      colorScheme: "light", // "auto" | "dark" | "light"
      brandColor: "", // Hex color code
      logo: "", // Absolute URL to image
      buttonText: "" // Hex color code
    },
    callbacks: {
      jwt: async ({ token, user, trigger, session  }) => {
        if (trigger === "update") {
          token.name = session.user.name;
          token.email = session.user.email;
          token.isAdmin = session.user.isAdmin;
          token.department = session.user.department;
        }
        else if (user) {
          token.name = user.name;
          token.email = user.email;
          token.isAdmin = user.isAdmin;
          token.department = user.department;
        }
        return Promise.resolve(token)
      },
      session: ({ session, token }) => {
        
        if (token) {
          session.user.email = token.email || "";
          session.user.name = token.name || "";
          session.user.isAdmin = token.isAdmin as boolean;
          session.user.department = token.department as string;
        }
        return Promise.resolve(session)
      },
    },
    events: {},
    adapter: MongoDBAdapter(clientPromise),
    debug: false,
  }
  