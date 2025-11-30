import { Button } from "@/components/ui/button"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { WeatherService } from "./service/api";
import { useEffect } from "react";
function App() {
  const goDocs = () => {
    window.open('http://localhost:3000/weather/docs', '_blank');
  };
  useEffect(() => {
    console.log("Tentando conectar ao backend...");
    WeatherService.getAll()
      .then((dados) => {
        console.log("✅ DADOS RECEBIDOS:", dados);
        alert(`Sucesso! Recebemos ${dados.length} registros de clima.`);
      })
      .catch((erro) => {
        console.error("❌ ERRO:", erro);
        alert("Erro ao conectar com o Backend. Verifique o console.");
      });
  }, []);
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-background text-foreground">
        
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

          <Button variant="secondary" size="lg" onClick={()=> goDocs()} className="color-transition duration-300">
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

        <div className="flex h-screen w-full flex-col items-center justify-center gap-6 bg-background text-foreground">
       <h1 className="text-4xl font-bold text-primary">Teste de Conexão</h1>
       <p>Abra o Console (F12) para ver os dados.</p>
       <Button onClick={() => WeatherService.exportCsv()}>Teste Download CSV</Button>
    </div>

      </div>
    </ThemeProvider>
  )
}

export default App