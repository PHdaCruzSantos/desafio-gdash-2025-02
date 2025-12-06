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

    while True:
        try:
            return pika.BlockingConnection(params)
        except pika.exceptions.AMQPConnectionError:
            print(f"⚠️ RabbitMQ indisponível em {config.RABBIT_HOST}:{config.RABBIT_PORT}. Tentando em 5s...")
            time.sleep(5)

def setup():
    print("🐰 Conectando ao RabbitMQ...")
    connection = get_connection()
    channel = connection.channel()
    channel.queue_declare(queue=config.QUEUE_NAME, durable=True)
    print(f"✅ Fila '{config.QUEUE_NAME}' garantida.")
    
    return connection, channel

def publish(channel, data):
    if not data: return

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