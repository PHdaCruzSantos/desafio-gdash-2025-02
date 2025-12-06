export interface WeatherData {
  main: {
    temp: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
  wind: {
    speed: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
}

export function determinePokemonType(weatherData: WeatherData, isNight: boolean): string {
  const { main, weather, wind } = weatherData;
  const temp = main.temp;
  const conditionMain = weather[0]?.main.toLowerCase() || '';
  const conditionDesc = weather[0]?.description.toLowerCase() || '';
  const windSpeed = wind.speed;

  // 1. Prioridade de Condições Extremas

  // Neve/Gelo
  if (conditionMain.includes('snow')) {
    return Math.random() > 0.5 ? 'ice' : 'steel';
  }

  // Tempestade
  if (conditionMain.includes('thunderstorm')) {
    return Math.random() > 0.5 ? 'electric' : 'dragon';
  }

  // Chuva
  if (conditionMain.includes('rain') || conditionMain.includes('drizzle')) {
    if (conditionDesc.includes('light') || conditionDesc.includes('drizzle')) {
      return 'bug'; // Chuva leve/úmido
    }
    if (conditionDesc.includes('acid') || conditionDesc.includes('freezing')) { // Freezing rain -> Poison (creative liberty for "acid"/hazardous) or Ice, sticking to Poison for pollution theme
       return 'poison';
    }
    return 'water'; // Chuva normal
  }

  // Atmosfera (Mist, Fog, Haze, Smoke, Dust, Sand, Ash, Squall, Tornado)
  const atmosphereConditions = ['mist', 'fog', 'haze', 'smoke', 'dust', 'sand', 'ash', 'squall', 'tornado'];
  if (atmosphereConditions.includes(conditionMain)) {
    const rand = Math.random();
    if (rand < 0.33) return 'ghost';
    if (rand < 0.66) return 'psychic';
    return 'poison';
  }

  // 2. Vento Forte (independente de temperatura se não for extremo acima)
  if (windSpeed > 5) {
    return Math.random() > 0.5 ? 'flying' : 'dragon';
  }

  // 3. Ciclo Dia/Noite (se não for clima extremo)
  if (isNight) {
    // Aumenta chance de Dark e Ghost
    const rand = Math.random();
    if (rand < 0.4) return 'dark';
    if (rand < 0.7) return 'ghost';
    // 30% de chance de cair nas regras de temperatura abaixo mesmo à noite
  }

  // 4. Influência da Temperatura

  // Calor Extremo
  if (temp > 30) {
    return Math.random() > 0.5 ? 'fire' : 'ground';
  }

  // Frio
  if (temp < 10) {
    return 'ice';
  }

  // Calor Agradável (20 - 29)
  if (temp >= 20 && temp <= 29) {
    if (conditionMain === 'clear' && !isNight) {
      return 'fairy'; // Clima perfeito
    }
    // Se não for clear (ex: clouds) ou for noite (caiu no fallback da noite)
    if (conditionMain.includes('cloud')) {
        return 'fighting'; // Treino
    }
    return Math.random() > 0.5 ? 'grass' : 'normal';
  }

  // Tipos Especiais / Fallback para temperaturas amenas (10-19) ou outras condições
  if (conditionMain === 'clear') {
      // Dia limpo mas fresco
      return 'grass'; 
  }
  
  if (conditionMain.includes('cloud')) {
      return 'fighting';
  }

  // Rock/Ground para clima seco/quente já coberto parcialmente, mas reforçando
  if (temp > 25 && conditionMain === 'clear') {
      return 'rock';
  }

  return 'normal';
}
