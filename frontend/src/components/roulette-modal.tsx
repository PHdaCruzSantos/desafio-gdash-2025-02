import { useEffect, useState } from 'react';
import { UserService } from '@/service/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Gift, Timer } from 'lucide-react';
import { useAuth } from '@/contexts/auth.context';

export function RouletteModal() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [wonPokemon, setWonPokemon] = useState<{ name: string; sprite: string } | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user?.lastSpin) {
      const lastSpinDate = new Date(user.lastSpin);
      const now = new Date();
      const diffSeconds = (now.getTime() - lastSpinDate.getTime()) / 1000;
      const remaining = 300 - diffSeconds;
      if (remaining > 0) {
        setCooldown(Math.ceil(remaining));
      }
    }
  }, [user]);

  useEffect(() => {
    let interval: any;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSpin = async () => {
    setLoading(true);
    setWonPokemon(null);
    try {
      const data = await UserService.spinRoulette();
      // Simulate a bit of suspense
      setTimeout(() => {
        setWonPokemon(data.pokemon);
        setCooldown(300);
        setLoading(false);
        
        // Update user context
        if (user) {
          const newCollection = user.pokemonCollection ? [...user.pokemonCollection, data.pokemon] : [data.pokemon];
          updateUser({
            lastSpin: new Date().toISOString(),
            pokemonCollection: newCollection
          });
        }

        toast({
          title: "Parabéns!",
          description: `Você capturou um ${data.pokemon.name}!`,
        });
      }, 2000);
    } catch (error: any) {
      setLoading(false);
      if (error.response?.status === 403) {
        const remaining = error.response.data.remainingSeconds;
        setCooldown(remaining);
        toast({
          variant: "destructive",
          title: "Aguarde o cooldown!",
          description: `Faltam ${formatTime(remaining)} para o próximo giro.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao girar",
          description: "Tente novamente mais tarde.",
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0"
          disabled={cooldown > 0}
        >
          {cooldown > 0 ? (
            <>
              <Timer className="w-4 h-4" />
              Disponível em {formatTime(cooldown)}
            </>
          ) : (
            <>
              <Gift className="w-4 h-4" />
              Capturar Pokémon
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Gift className="w-6 h-6 text-primary" />
            Roleta Pokémon
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6 flex flex-col items-center justify-center min-h-[300px]">
          {wonPokemon ? (
            <div className="animate-in zoom-in duration-500 flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 rounded-full animate-pulse"></div>
                <img 
                  src={wonPokemon.sprite} 
                  alt={wonPokemon.name} 
                  className="w-48 h-48 relative z-10 drop-shadow-lg"
                />
              </div>
              <h2 className="text-2xl font-bold capitalize text-primary">{wonPokemon.name}</h2>
              <p className="text-muted-foreground">Adicionado à sua coleção!</p>
              <Button onClick={() => setWonPokemon(null)} variant="outline" className="mt-4">
                Girar Novamente (se puder)
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6 w-full">
              <div className="w-48 h-48 bg-muted rounded-full flex items-center justify-center border-4 border-dashed border-muted-foreground/30 relative overflow-hidden">
                {loading ? (
                  <Loader2 className="w-16 h-16 animate-spin text-primary" />
                ) : (
                  <img 
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" 
                    alt="Pokeball" 
                    className={`w-32 h-32 opacity-80 transition-transform duration-700 ${cooldown > 0 ? 'grayscale' : 'hover:scale-110 hover:rotate-12'}`}
                  />
                )}
              </div>

              {cooldown > 0 ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <span className="text-lg font-medium">Próximo giro em:</span>
                  <div className="text-4xl font-mono font-bold flex items-center gap-2 text-primary">
                    <Timer className="w-6 h-6" />
                    {formatTime(cooldown)}
                  </div>
                </div>
              ) : (
                <Button 
                  size="lg" 
                  className="w-full text-lg h-14 font-bold animate-bounce-slow" 
                  onClick={handleSpin} 
                  disabled={loading}
                >
                  {loading ? 'Sorteando...' : 'GIRAR AGORA!'}
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
