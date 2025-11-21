import os
import time
import requests
import sys

def get_env(key):
  value = os.getenv(key)
  if not value:
    print(f"Error -> {key} não definida")
    sys.exit(1)
  return value

API_KEY = get_env("OPENWEATHER_API_KEY")
LAT = get_env("WEATHER_LAT")
LON = get_env("WEATHER_LON")
UNITS = os.getenv("WEATHER_UNITS", "metric")
LANG = os.getenv("WEATHER_LANG", "pt_br")
INTERVAL = int(os.getenv("WEATHER_CHECK_INTERVAL", "60"))

def fetch_weather():
  url = f"https://api.openweathermap.org/data/2.5/weather?lat={LAT}&lon={LON}&appid={API_KEY}&units={UNITS}&lang={LANG}"

  try:
    res = requests.get(url, timeout=10)
    res.raise_for_status()
    return res.json()
  except requests.exceptions.RequestException as e:
    print(f"Error na requisição HTTP: {e}")
    return None

def process_data(data):
    """Extrai e estrutura os dados do JSON bruto"""
    if not data:
        return
    
    # Tratamento defensivo para campos opcionais (chuva/neve)
    rain_volume = data.get("rain", {}).get("1h", 0)
    
    weather = {
        "city": data.get("name"),
        "temp": data["main"]["temp"],
        "feels_like": data["main"]["feels_like"], 
        "temp_min": data["main"]["temp_min"],     
        "temp_max": data["main"]["temp_max"],     
        "pressure": data["main"]["pressure"],     
        "humidity": data["main"]["humidity"],
        "description": data["weather"][0]["description"],
        "wind_speed": data["wind"]["speed"],
        "wind_deg": data["wind"].get("deg", 0),    
        "visibility": data.get("visibility", 10000),
        "sunrise": data["sys"]["sunrise"],         
        "sunset": data["sys"]["sunset"],          
        "rain_1h": rain_volume                    
    }
    
    # Log enriquecido para visualizarmos agora
    print("-" * 60)
    print(f"📍 {weather['city']} | {weather['description'].upper()}")
    print(f"🌡️  Temp: {weather['temp']}°C (Sente: {weather['feels_like']}°C)")
    print(f"💧 Umidade: {weather['humidity']}% | Pressão: {weather['pressure']} hPa")
    print(f"💨 Vento: {weather['wind_speed']} m/s | Chuva (1h): {weather['rain_1h']} mm")
    print(f"👁️  Visibilidade: {weather['visibility']}m")
    print("-" * 60)
    
    return weather


def main():
  while True:
    data = fetch_weather()
    process_data(data)
    time.sleep(INTERVAL)

if __name__ == "__main__":
    main()