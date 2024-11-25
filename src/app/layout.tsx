import localFont from "next/font/local";
import "../globals.css";
import { AppSidebar } from "@/component/app-sidebar";
import { SidebarProvider } from "@/context/sidebar-context";
import { AppHeader } from "@/component/app-header";
import { UserProvider } from "@/context/user-context";
const geistSans = localFont({
  src: "../../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <SidebarProvider>
            <main
              className={`${geistSans.variable} ${geistMono.variable} antialiased w-full min-h-screen flex`}
            >
              <AppSidebar />
              <div
                className={`
                  border border-gray-200
                  flex-1 
                  transition-[margin-left]
                  ease-in-out
                  duration-300 
                  relative
                `}
              >
                <AppHeader />
                {children}
              </div>
            </main>
          </SidebarProvider>
        </UserProvider>
      </body>
    </html>
  );
}
