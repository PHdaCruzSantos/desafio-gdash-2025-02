import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, CloudRain, Sparkles } from "lucide-react";
import { PokemonService, api } from "@/service/api";
import type {  PokemonListResponse } from "@/service/api";
import { PokemonCard } from "@/components/pokemon-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hooks/use-debounce";
import { CityAutocomplete } from "@/components/ui/city-autocomplete";

export function ExplorePage() {
  const [activeTab, setActiveTab] = useState("explorer");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [data, setData] = useState<PokemonListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 600);

  const [weatherCity, setWeatherCity] = useState("");
  const [weatherResult, setWeatherResult] = useState<any>(null);
  const [matchedType, setMatchedType] = useState<string | null>(null);
  const [matchedPokemons, setMatchedPokemons] = useState<any[]>([]);
  const [loadingMatch, setLoadingMatch] = useState(false);

  const fetchData = async (overridePage = page) => {
      setLoading(true);
      try {
        if (debouncedSearch) {
          const detail = await PokemonService.getDetails(debouncedSearch.toLowerCase());
          setData({ data: [{ name: detail.name, url: "" }], total: 1, totalPages: 1 });
        } else {
          const response = await PokemonService.getAll(overridePage, limit);
          setData(response);
        }
      } catch (error) {
        if (debouncedSearch) setData({ data: [], total: 0, totalPages: 0 });
      } finally {
        setLoading(false);
      }
  };

  useEffect(() => {
    if (activeTab === "explorer") {
        if (!debouncedSearch) fetchData(page);
    }
  }, [page, limit, activeTab]);

  useEffect(() => {
    if (activeTab === "explorer") {
        if (debouncedSearch !== "") fetchData(1);
        else if (searchTerm === "" && !loading) fetchData(1);
    }
  }, [debouncedSearch]);


  const handleWeatherSearch = async () => {
    if (!weatherCity) return;
    setLoadingMatch(true);
    setMatchedPokemons([]);
    setWeatherResult(null);

    try {
      const { data: weather } = await api.get(`/weather/current?city=${weatherCity}`);
      setWeatherResult(weather);

      let type = "normal";
      const temp = weather.temp;
      const condition = weather.main.toLowerCase();

      if (condition.includes("rain") || condition.includes("drizzle")) type = "water";
      else if (condition.includes("thunder")) type = "electric";
      else if (condition.includes("snow")) type = "ice";
      else if (temp >= 30) type = "fire";
      else if (temp >= 20 && condition.includes("clear")) type = "grass";
      else if (condition.includes("clouds")) type = "flying";
      else if (temp < 10) type = "ice";
      
      setMatchedType(type);

      const pokemons = await PokemonService.getAll(1, 12, type); 
      setMatchedPokemons(pokemons.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMatch(false);
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-700">
      
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-primary">Pokédex & Clima</h2>
        <p className="text-muted-foreground">
          Explore o catálogo ou descubra qual Pokémon combina com o tempo lá fora.
        </p>
      </div>

      <Tabs defaultValue="explorer" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="explorer">Explorador</TabsTrigger>
          <TabsTrigger value="matcher">Radar Climático</TabsTrigger>
        </TabsList>

        <TabsContent value="explorer" className="space-y-6 mt-6">
           
           <div className="relative w-full max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Pesquisar pokémon por nome..." 
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading
                ? Array.from({ length: limit }).map((_, i) => <div key={i} className="h-72 bg-muted/20 animate-pulse rounded-xl" />)
                : data?.data.map((p) => <PokemonCard key={p.name} name={p.name} />)
            }
            {!loading && data?.data.length === 0 && (
                <div className="col-span-full text-center py-10 text-muted-foreground">
                    Nenhum Pokémon encontrado.
                </div>
            )}
           </div>
           
           {data && !debouncedSearch && data.data.length > 0 && (
            <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
              </Button>
              
              <span className="text-sm font-medium text-muted-foreground">
                Página <span className="text-foreground font-bold">{page}</span> de {data.totalPages}
              </span>

              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={page >= data.totalPages || loading}
              >
                Próximo <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
           )}
        </TabsContent>

        <TabsContent value="matcher" className="mt-6 space-y-8">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-primary" />
                Qual Pokémon aparece no seu clima?
              </CardTitle>
              <CardDescription>
                Digite sua cidade. O sistema analisará a temperatura e condição para sugerir o tipo ideal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="flex gap-2 max-w-md items-start">
                <div className="flex-1">
                    <CityAutocomplete 
                        onSelect={(city) => setWeatherCity(city)} 
                        placeholder="Ex: Tokyo, London..."
                    />
                </div>
                <Button onClick={handleWeatherSearch} disabled={loadingMatch || !weatherCity}>
                  {loadingMatch ? "Analisando..." : "Investigar"}
                </Button>
              </div>

              {weatherResult && (
                <div className="mt-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                  <div className="flex items-center gap-4 mb-6 p-4 bg-background/50 rounded-lg border">
                    <div className="text-4xl font-bold text-primary">{Math.round(weatherResult.temp)}°C</div>
                    <div className="space-y-1">
                      <p className="font-medium capitalize">{weatherResult.description}</p>
                      <Badge variant="outline" className="capitalize">
                        Clima: {weatherResult.main}
                      </Badge>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-sm text-muted-foreground">Tipo Detectado</p>
                      <Badge className="text-lg px-4 py-1 uppercase tracking-widest bg-gradient-to-r from-indigo-500 to-purple-500 border-none text-white shadow-lg">
                        {matchedType}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    Pokémons Atuando na Região:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {matchedPokemons.map((p) => (
                      <PokemonCard key={p.name} name={p.name} />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}