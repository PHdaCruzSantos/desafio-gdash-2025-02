import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/auth.context";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CloudSun, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Schemas de Validação
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Nome muito curto"),
});

export function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const from = location.state?.from?.pathname || "/";

  const formLogin = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const formRegister = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const showError = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError("");
    }, 5000);
  };

  async function onLogin(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    setError("");
    try {
      await login(values.email, values.password);
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo de volta ao GDASH Weather.",
      })
      navigate(from, { replace: true });
    } catch (err) {
      showError("Falha ao entrar. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onRegister(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    setError("");
    try {
      await register(values.name, values.email, values.password);
      toast({
        title: "Conta criada com sucesso!",
        description: "Você já pode acessar o sistema.",
      })
      navigate(from, { replace: true });
    } catch (err) {
      showError("Erro ao registrar. Email já pode estar em uso.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md border-primary/20 shadow-lg relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute border radius-full right-4 top-4 text-muted-foreground hover:rotate-[360deg] transition-transform duration-500"
          onClick={() => navigate("/")}
        >
          <X className="h-10 w-10" />
        </Button>
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <CloudSun className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary">GDASH Weather</CardTitle>
          <CardDescription>Acesse sua estação climática inteligente.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Form {...formLogin}>
                <form onSubmit={formLogin.handleSubmit(onLogin)} className="space-y-4">
                  <FormField
                    control={formLogin.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input placeholder="seu@email.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formLogin.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl><Input type="password" placeholder="******" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {error && <p className="text-sm text-destructive text-center animate-in fade-in slide-in-from-top-1">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Acessar Sistema"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            {/* ABA REGISTRO */}
            <TabsContent value="register">
              <Form {...formRegister}>
                <form onSubmit={formRegister.handleSubmit(onRegister)} className="space-y-4">
                  <FormField
                    control={formRegister.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl><Input placeholder="Seu nome" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formRegister.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input placeholder="seu@email.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={formRegister.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl><Input type="password" placeholder="Mínimo 6 caracteres" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {error && <p className="text-sm text-destructive text-center animate-in fade-in slide-in-from-top-1">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Criando conta..." : "Criar Conta"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
          <div className="mt-4 text-center">
            <Button variant="link" className="text-muted-foreground" onClick={() => navigate("/")}>
              Voltar para Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}