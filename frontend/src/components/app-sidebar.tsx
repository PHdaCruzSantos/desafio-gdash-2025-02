import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Users, Compass, Menu, Sun, Moon, CloudSun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const MENU_ITEMS = [
  { icon: Users, label: "Usuários", path: "/users" },
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Compass, label: "Explorar", path: "/explore" },
]

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const { pathname } = useLocation()
  const { theme, setTheme } = useTheme()

  const NavItem = ({ item, isMobile = false }: { item: typeof MENU_ITEMS[0], isMobile?: boolean }) => {
    const isActive = pathname === item.path
    const Icon = item.icon

    if (isMobile || !isCollapsed) {
      return (
        <Link
          to={item.path}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 animate-in fade-in slide-in-from-left-2",
            isActive 
              ? "bg-primary/10 text-primary" 
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Icon className="h-5 w-5 shrink-0" />
          <span className="whitespace-nowrap overflow-hidden">{item.label}</span>
        </Link>
      )
    }

    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Link
            to={item.path}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md transition-colors",
              isActive 
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="sr-only">{item.label}</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    )
  }

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex h-full flex-col overflow-hidden">
      <div className={cn("flex h-16 items-center px-4 transition-all", isCollapsed && !isMobile ? "justify-center" : "gap-2")}>
        <CloudSun className="h-6 w-6 text-primary shrink-0" />
        {(!isCollapsed || isMobile) && (
          <span className="font-bold text-lg tracking-tight whitespace-nowrap transition-all duration-300">
            GDASH
          </span>
        )}
      </div>

      <div className="flex-1 py-4 overflow-x-hidden">
        <nav className={cn("grid gap-1 px-2", isCollapsed && !isMobile && "justify-center")}>
          {MENU_ITEMS.map((item) => (
            <NavItem key={item.path} item={item} isMobile={isMobile} />
          ))}
        </nav>
      </div>

      <div className="border-t p-4">
        <Button
          variant="ghost"
          size={isCollapsed && !isMobile ? "icon" : "default"}
          className={cn("w-full justify-start", isCollapsed && !isMobile && "justify-center")}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-5 w-5 shrink-0" /> : <Moon className="h-5 w-5 shrink-0" />}
          {(!isCollapsed || isMobile) && <span className="ml-3 whitespace-nowrap">Alternar Tema</span>}
        </Button>
      </div>
    </div>
  )

  return (
    <TooltipProvider>
      <aside
        onMouseEnter={() => setIsCollapsed(false)}
        onMouseLeave={() => setIsCollapsed(true)}
        className={cn(
          "hidden md:flex md:flex-col fixed inset-y-0 z-50 border-r bg-card transition-all duration-300 ease-in-out shadow-lg",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>

      <div className="md:hidden flex items-center gap-4 border-b bg-card p-4 fixed top-0 w-full z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SidebarContent isMobile={true} />
          </SheetContent>
        </Sheet>
        <span className="font-bold text-lg">GDASH Weather</span>
      </div>
    </TooltipProvider>
  )
}