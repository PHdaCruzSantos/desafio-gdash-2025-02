import { useEffect, useState } from "react";
import { PokemonService } from "@/service/api";
import type {PokemonDetails} from "@/service/api"
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getTypeColor } from "@/lib/pokemon-types";
import { cn } from "@/lib/utils";

interface PokemonCardProps {
  name: string;
}

export function PokemonCard({ name }: PokemonCardProps) {
  const [data, setData] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca detalhes para pegar imagem e tipos
    PokemonService.getDetails(name)
      .then(setData)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [name]);

  if (loading || !data) {
    return <Skeleton className="h-64 w-full rounded-xl" />;
  }

  const mainType = data.types[0].type.name;
  const gradientClass = getTypeColor(mainType);
  const imageUrl = data.sprites.other["official-artwork"].front_default;

  return (
    <Card className={cn(
      "relative overflow-hidden border-none shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl group",
      `bg-gradient-to-br ${gradientClass}`
    )}>
      {/* Background Decorativo (Bolha) */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-2xl transition-all group-hover:bg-white/30" />

      <CardContent className="flex flex-col items-center p-6">
        {/* Imagem (com efeito de flutuar) */}
        <div className="relative z-10 h-40 w-40 drop-shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        </div>

        {/* Nome e ID */}
        <div className="mt-4 flex w-full flex-col items-center gap-2 z-10">
          <span className="text-xs font-bold text-white/70">
            #{String(data.id).padStart(3, "0")}
          </span>
          <h3 className="text-2xl font-bold capitalize text-white tracking-wide drop-shadow-sm">
            {name}
          </h3>

          {/* Badges de Tipos */}
          <div className="flex gap-2 mt-1">
            {data.types.map((t) => (
              <Badge 
                key={t.type.name} 
                variant="secondary" 
                className="bg-white/20 text-white backdrop-blur-md border-transparent hover:bg-white/30"
              >
                {t.type.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}