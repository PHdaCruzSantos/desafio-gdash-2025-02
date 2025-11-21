import time
import config
import weather_client
import rabbit_client

def main():
    print(f"🚀 Iniciando Coletor de Clima ({config.INTERVAL}s intervalo)")
    

    connection, channel = rabbit_client.setup()

    try:
        while True:
            raw = weather_client.fetch_weather()
            data = weather_client.process_data(raw)
            
            if data:
                print(f"📍 Lido: {data['description']} | {data['temp']}°C")

            
            rabbit_client.publish(channel, data)
            
            time.sleep(config.INTERVAL)
            
    except KeyboardInterrupt:
        print("\n🛑 Parando serviço...")
        connection.close()
    except Exception as e:
        print(f"❌ Erro Fatal: {e}")
        if 'connection' in locals() and connection.is_open:
            connection.close()

if __name__ == "__main__":
    main()