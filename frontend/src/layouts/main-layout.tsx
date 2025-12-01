import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"

export function MainLayout() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
        
        <AppSidebar />

        <main className="flex-1 p-6 md:ml-16 transition-all duration-300">
            <div className="mx-auto max-w-6xl animate-in fade-in duration-500">
              <Outlet />
            </div>
        </main>
      </div>
    </ThemeProvider>
  )
}