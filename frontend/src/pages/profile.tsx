import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/auth.context";
import { UserService } from "@/service/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Save, Trash2, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RouletteModal } from "@/components/roulette-modal";

const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  description: z.string().optional(),
  photo: z.string().url("URL da foto inválida").optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      description: "",
      photo: "",
    },
  });

  useEffect(() => {
    if (user) {
      console.table(user)
      const fetchUser = async () => {
        try {
           form.reset({
             name: user.name,
             email: user.email,
             description: (user as any).description || "",
             photo: (user as any).photo || "",
           });
        } catch (e) {
          console.error(e);
        }
      };
      fetchUser();
    }
  }, [user, form]);

  async function onSubmit(values: ProfileFormValues) {
    if (!user) return;
    setLoading(true);
    try {
      const updatedUser = await UserService.updateProfile(user.id, {
        name: values.name,
        email: values.email,
        description: values.description,
      });
      if(!updatedUser) throw new Error("Falha na atualização");

      updateUser({
        name: values.name,
        email: values.email,
        description: values.description,
      });

      toast({ title: "Perfil atualizado!", description: "Suas informações foram salvas." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações.",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      setLoading(true);
      const response = await UserService.uploadAvatar(user.id, file);
      
      updateUser({ photo: response.photo });

      toast({ title: "Foto atualizada!", description: "Sua nova foto de perfil foi salva." });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro no upload",
        description: "Não foi possível enviar a foto.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !deletePassword) return;
    setIsDeleting(true);
    try {
      await UserService.delete(user.id, deletePassword);
      toast({ title: "Conta excluída", description: "Sua conta foi removida com sucesso." });
      logout();
      window.location.href = "/";
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Senha incorreta ou erro no servidor.",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (!user) return <div>Carregando...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-primary">Meu Perfil</h2>
        <RouletteModal />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            <Avatar className="h-20 w-20 border-2 border-primary/20 group-hover:opacity-75 transition-opacity">
              <AvatarImage src={
                (() => {
                  const photoUrl = (user as any).photo || form.watch('photo');
                  if (photoUrl && photoUrl.startsWith('/uploads')) {
                    return `http://localhost:3000${photoUrl}`;
                  }
                  return photoUrl;
                })()
              } />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-primary font-bold" />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input disabled placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <CardDescription>O email não pode ser alterado.</CardDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio / Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Conte um pouco sobre você..." 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-4">
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" type="button">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir Conta
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Excluir Conta</DialogTitle>
                      <DialogDescription>
                        Esta ação é irreversível. Por favor, digite sua senha para confirmar.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Input 
                        type="password" 
                        placeholder="Sua senha atual" 
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
                      <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting || !deletePassword}>
                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirmar Exclusão"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {user.pokemonCollection && user.pokemonCollection.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Minha Coleção Pokémon</CardTitle>
            <CardDescription>Você já capturou {user.pokemonCollection.length} Pokémons!</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {user.pokemonCollection.map((poke, index) => (
                <div key={`${poke.id}-${index}`} className="flex flex-col items-center p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                  <img src={poke.sprite} alt={poke.name} className="w-24 h-24 drop-shadow-md" />
                  <span className="font-bold capitalize mt-2">{poke.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(poke.capturedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
