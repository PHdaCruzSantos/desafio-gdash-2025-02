import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { 
  LayoutDashboard, Users, Compass, Menu, Sun, Moon, CloudSun, LogOut, LogIn
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "@/components/theme-provider"
import { useAuth } from "@/contexts/auth.context"
import { cn } from "@/lib/utils"

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Users, label: "Meu Perfil", path: "/profile" },
  { icon: Compass, label: "Explorar", path: "/explore" },
]

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const { pathname } = useLocation()
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()

  const getInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"
  }

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
      {/* Header */}
      <div className={cn("flex h-16 items-center px-4 transition-all", isCollapsed && !isMobile ? "justify-center" : "gap-2")}>
        <CloudSun className="h-6 w-6 text-primary shrink-0" />
        {(!isCollapsed || isMobile) && (
          <span className="font-bold text-lg tracking-tight whitespace-nowrap transition-all duration-300">
            GDASH
          </span>
        )}
      </div>

      {/* Navegação */}
      <div className="flex-1 py-4 overflow-x-hidden">
        <nav className={cn("grid gap-1 px-2", isCollapsed && !isMobile && "justify-center")}>
        {user ? (
          <div className={cn(
            "flex items-center gap-3 pt-2 pb-6 mt-2 border-t  border-border/50 transition-all", 
            isCollapsed && !isMobile ? "flex-col justify-center" : "justify-between"
          )}>
            <div className={cn("flex items-center gap-3", isCollapsed && !isMobile ? "justify-center" : "")}>
              <Avatar className="h-8 w-8 border border-primary/20">
                <AvatarImage src={
                (() => {
                  const photoUrl = user.photo;
                  if (photoUrl && photoUrl.startsWith('/uploads')) {
                    return `http://localhost:3000${photoUrl}`;
                  }
                  return photoUrl;
                })()
              } />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              
              {(!isCollapsed || isMobile) && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium truncate max-w-[120px]" title={user.name}>
                    {user.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground truncate max-w-[120px]" title={user.email}>
                    {user.email}
                  </span>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
              onClick={logout}
              title="Sair do sistema"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className={cn("pt-2 mt-2 border-t pb-6 border-border/50", isCollapsed && !isMobile ? "flex justify-center" : "")}>
            {isCollapsed && !isMobile ? (
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button asChild variant="outline" size="icon" className="h-9 w-9 text-primary border-primary/20 hover:bg-primary/10">
                    <Link to="/login">
                      <LogIn className="h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Entrar no Sistema</TooltipContent>
              </Tooltip>
            ) : (
              <Button asChild className="w-full" variant="outline">
                <Link to="/login" className="flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Entrar</span>
                </Link>
              </Button>
            )}
          </div>
        )}
          {MENU_ITEMS.map((item) => (
            <NavItem  key={item.path} item={item} isMobile={isMobile} />
          ))}
        </nav>
      </div>

      {/* Footer (Tema + Auth Toggle) */}
      <div className="border-t p-4 space-y-2">
        
        {/* Botão de Tema */}
        <Button
          variant="ghost"
          size={isCollapsed && !isMobile ? "icon" : "sm"}
          className={cn("w-full justify-start", isCollapsed && !isMobile && "justify-center")}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-5 w-5 shrink-0" /> : <Moon className="h-5 w-5 shrink-0" />}
          {(!isCollapsed || isMobile) && <span className="ml-3 whitespace-nowrap">Tema {theme === 'dark' ? 'Claro' : 'Escuro'}</span>}
        </Button>

        
      </div>
    </div>
  )

  return (
    <TooltipProvider>
      {/* Desktop Sidebar */}
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

      {/* Mobile Header */}
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