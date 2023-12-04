import NextAuth from "next-auth"
import { nextAuthConfig } from "@/components/Authentication/NextAuthConfig";
export default NextAuth(nextAuthConfig);