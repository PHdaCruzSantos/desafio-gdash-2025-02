import { useState, useEffect, useRef } from "react";
import { Search, Loader2, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { WeatherService } from "@/service/api";
import { useDebounce } from "@/hooks/use-debounce";

interface CityAutocompleteProps {
  onSelect: (city: string) => void;
  placeholder?: string;
}

export function CityAutocomplete({ onSelect, placeholder }: CityAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const debouncedQuery = useDebounce(query, 500);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchCities() {
      if (debouncedQuery.length < 3) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const results = await WeatherService.searchCities(debouncedQuery);
        setSuggestions(results);
        setIsOpen(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCities();
  }, [debouncedQuery]);

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (cityLabel: string) => {
    setQuery(cityLabel);
    setSuggestions([]);
    setIsOpen(false);
    onSelect(cityLabel); // Passa para o pai
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder || "Digite a cidade..."}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value === "") setIsOpen(false);
          }}
          className="pl-9"
        />
        {loading && (
          <div className="absolute right-3 top-3">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground rounded-md border shadow-md animate-in fade-in-0 zoom-in-95">
          <ul className="py-1">
            {suggestions.map((city, index) => (
              <li
                key={index}
                className="px-4 py-2 text-sm hover:bg-muted cursor-pointer flex items-center gap-2"
                onClick={() => handleSelect(city.name)} // Passamos só o nome para o OpenWeather funcionar melhor
              >
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span>
                  <span className="font-medium">{city.name}</span>
                  <span className="text-muted-foreground text-xs ml-1">
                    {city.state ? `, ${city.state}` : ''}, {city.country}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}