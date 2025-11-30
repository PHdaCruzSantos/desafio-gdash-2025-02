import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-background text-foreground transition-colors duration-500">
        
        {/* Cabeçalho com o Toggle */}
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-primary">
          GDASH Weather
        </h1>
        
        <p className="text-muted-foreground text-lg">
          Teste o botão no canto superior direito! ↗️
        </p>
        
        <div className="flex gap-4">
          <Button size="lg">
            Acessar Dashboard
          </Button>

          <Button variant="secondary" size="lg">
            Documentação
          </Button>
        </div>

        {/* Exemplo de card para ver contraste */}
        <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-sm max-w-sm">
          <h3 className="font-semibold text-lg mb-2">Teste de Contraste</h3>
          <p className="text-sm text-muted-foreground">
            Este card deve ficar branco no modo claro e cinza escuro no modo escuro.
            A cor primária (#50e3c2) deve se destacar em ambos.
          </p>
        </div>

      </div>
    </ThemeProvider>
  )
}

export default App