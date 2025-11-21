import requests
import time
import config

def fetch_weather():
    """Busca o JSON bruto da API"""
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={config.LAT}&lon={config.LON}&appid={config.API_KEY}&units={config.UNITS}&lang={config.LANG}"

    try:
        res = requests.get(url, timeout=10)
        res.raise_for_status()
        return res.json()
    except requests.exceptions.RequestException as e:
        print(f"⚠️ Erro na API OpenWeather: {e}")
        return None

def process_data(data):
    """Limpa e formata os dados"""
    if not data: return None
    
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
        "rain_1h": rain_volume,
        "timestamp": int(time.time())
    }
    return weather