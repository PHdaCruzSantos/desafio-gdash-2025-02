import pika
import time
import json
import config

def get_connection():
    credentials = pika.PlainCredentials(config.RABBIT_USER, config.RABBIT_PASS)
    params = pika.ConnectionParameters(
        host=config.RABBIT_HOST, 
        port=config.RABBIT_PORT, 
        credentials=credentials
    )

    for _ in range(5):
        try:
            return pika.BlockingConnection(params)
        except pika.exceptions.AMQPConnectionError:
            print(f"⚠️ RabbitMQ indisponível em {config.RABBIT_HOST}. Tentando em 5s...")
            time.sleep(5)
    
    raise Exception("Não foi possível conectar ao RabbitMQ após várias tentativas.")

def send_message(data):
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