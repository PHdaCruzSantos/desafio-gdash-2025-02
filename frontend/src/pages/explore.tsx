import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import { PokemonService } from "@/service/api";
import type {PokemonListResponse } from "@/service/api";
import { PokemonCard } from "@/components/pokemon-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ExplorePage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState<PokemonListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const fetchList = async (pageNumber: number, currentLimit: number) => {
    setLoading(true);
    try {
      const response = await PokemonService.getAll(pageNumber, currentLimit);
      setData(response);
      setPage(pageNumber);
      setIsSearchMode(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Erro ao buscar lista", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const detail = await PokemonService.getDetails(searchTerm.toLowerCase());
      
      setData({
        data: [{ name: detail.name, url: "" }],
        total: 1,
        totalPages: 1
      });
      setIsSearchMode(true);
      setPage(1);
    } catch (error) {
      console.error("Pokémon não encontrado", error);
      setData({ data: [], total: 0, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    fetchList(1, limit);
  };

  const handleLimitChange = (value: string) => {
    const newLimit = Number(value);
    setLimit(newLimit);
    if (!isSearchMode) {
      fetchList(1, newLimit);
    }
  };

  useEffect(() => {
    fetchList(1, limit);
  }, []);

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-700">
      
      <div className="flex flex-col lg:flex-row justify-between items-end gap-6 border-b pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-primary">Pokédex Explorer</h2>
          <p className="text-muted-foreground mt-2">
            Gerencie a visualização e encontre seu Pokémon favorito.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="w-full sm:w-32">
            <Select 
              value={String(limit)} 
              onValueChange={handleLimitChange} 
              disabled={isSearchMode}
            >
              <SelectTrigger>
                <SelectValue placeholder="Por pág." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12 itens</SelectItem>
                <SelectItem value="24">24 itens</SelectItem>
                <SelectItem value="48">48 itens</SelectItem>
                <SelectItem value="100">100 itens</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative w-full sm:w-72 flex gap-2">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nome..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              {isSearchMode && (
                <button 
                  onClick={clearSearch}
                  className="absolute right-2 top-2.5 hover:text-destructive transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button onClick={handleSearch} disabled={!searchTerm}>
              Buscar
            </Button>
          </div>
        </div>
      </div>

      {data?.data.length === 0 && !loading ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-xl">Nenhum Pokémon encontrado</p>
          <Button variant="link" onClick={clearSearch}>Limpar filtros</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: isSearchMode ? 1 : limit }).map((_, i) => (
                <div key={i} className="h-72 w-full rounded-xl bg-muted/20 animate-pulse" />
              ))
            : data?.data.map((pokemon) => (
                <PokemonCard key={pokemon.name} name={pokemon.name} />
              ))}
        </div>
      )}

      {data && !isSearchMode && data.data.length > 0 && (
        <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => fetchList(page - 1, limit)}
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
          </Button>
          
          <span className="text-sm font-medium text-muted-foreground">
            Página <span className="text-foreground font-bold">{page}</span> de {data.totalPages}
          </span>

          <Button
            variant="outline"
            onClick={() => fetchList(page + 1, limit)}
            disabled={page >= data.totalPages || loading}
          >
            Próximo <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}