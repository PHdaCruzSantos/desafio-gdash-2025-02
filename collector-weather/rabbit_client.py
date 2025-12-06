import pika
import time
import json
import config

def get_connection():
    """Gerencia a conexão com retry"""
    credentials = pika.PlainCredentials(config.RABBIT_USER, config.RABBIT_PASS)
    params = pika.ConnectionParameters(
        host=config.RABBIT_HOST, 
        port=config.RABBIT_PORT, 
        credentials=credentials
    )

    # Tenta conectar algumas vezes antes de desistir
    for _ in range(5):
        try:
            return pika.BlockingConnection(params)
        except pika.exceptions.AMQPConnectionError:
            print(f"⚠️ RabbitMQ indisponível em {config.RABBIT_HOST}. Tentando em 5s...")
            time.sleep(5)
    
    # Se falhar 5 vezes, levanta erro para o main tratar
    raise Exception("Não foi possível conectar ao RabbitMQ após várias tentativas.")

def send_message(data):
    """
    NOVA LÓGICA: Stateless (Sem estado).
    Abre conexão, envia e fecha imediatamente.
    Isso evita o erro de Timeout/Heartbeat durante o sleep longo.
    """
    if not data: return

    connection = None
    try:
        connection = get_connection()
        channel = connection.channel()
        
        channel.queue_declare(queue=config.QUEUE_NAME, durable=True)
        
        body_msg = json.dumps(data)
        
        channel.basic_publish(
            exchange='',
            routing_key=config.QUEUE_NAME,
            body=body_msg,
            properties=pika.BasicProperties(
                delivery_mode=2, 
            )
        )
        print(f"📤 [Enviado] {data['city']} | {data['temp']}°C")
        
    except Exception as e:
        print(f"❌ Erro ao enviar para o RabbitMQ: {e}")
    finally:
       
        if connection and not connection.is_closed:
            connection.close()