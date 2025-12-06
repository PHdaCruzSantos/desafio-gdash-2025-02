import time
import config
import weather_client
import rabbit_client

def main():
    print(f"🚀 Iniciando Coletor de Clima (Intervalo: {config.INTERVAL}s)")
    
    try:
        while True:
            raw = weather_client.fetch_weather()
            data = weather_client.process_data(raw)
            
            if data:
                print(f"📍 Lido: {data['description']} | {data['temp']}°C")
                rabbit_client.send_message(data)

            print(f"💤 Dormindo...")
            time.sleep(config.INTERVAL)
            
    except KeyboardInterrupt:
        print("\n🛑 Parando serviço...")
    except Exception as e:
        print(f"❌ Erro Fatal no Loop: {e}")

if __name__ == "__main__":
    main()