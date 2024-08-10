
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./animations.css"
import { Box, ThemeProvider } from "@mui/material";
import Navbar from "@/components/Navbar";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import theme from "@/theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HeadPantry",
  description: "Pantry Management System made by Akhil Trivedi for HeadStarter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

 
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider theme={theme}>
            <Box height='100vh' width='100vw' display="flex" flexDirection={"column"} bgcolor={"secondary.dark"}>
              <Navbar/>
              {children}
            </Box>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
