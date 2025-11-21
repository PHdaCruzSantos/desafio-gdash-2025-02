import os
import sys

def get_env(key, default=None):
    value = os.getenv(key, default)
    if not value:
        print(f"❌ Erro de Configuração: {key} não definida.")
        sys.exit(1)
    return value

# OpenWeather
API_KEY = get_env("OPENWEATHER_API_KEY")
LAT = get_env("WEATHER_LAT")
LON = get_env("WEATHER_LON")
UNITS = os.getenv("WEATHER_UNITS", "metric")
LANG = os.getenv("WEATHER_LANG", "pt_br")
INTERVAL = int(os.getenv("WEATHER_CHECK_INTERVAL", "60"))

# RabbitMQ
RABBIT_HOST = os.getenv("RABBITMQ_HOST", "rabbitmq")
RABBIT_PORT = int(os.getenv("RABBITMQ_PORT", "5672"))
RABBIT_USER = os.getenv("RABBITMQ_USER", "user")
RABBIT_PASS = os.getenv("RABBITMQ_PASS", "password")
QUEUE_NAME = "weather_data"