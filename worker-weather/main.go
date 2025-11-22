package main
import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

type WeatherData struct {
	City        string  `json:"city"`
	Temp        float64 `json:"temp"`
	FeelsLike   float64 `json:"feels_like"`
	Humidity    int     `json:"humidity"`
	Description string  `json:"description"`
	Timestamp   int64   `json:"timestamp"`
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func onError(err error, msg string) {
	if err != nil {
		log.Fatalf("%s: %s", msg, err)
	}
}

func connectRabbitMQ(connString string) *amqp.Connection {
	var counts int64
	for {
		conn, err := amqp.Dial(connString)
		if err == nil {
			return conn
		}

		counts++
		log.Printf("⚠️ RabbitMQ não pronto... Tentativa #%d", counts)
		time.Sleep(5 * time.Second)
	}
}

func main() {
	log.Println("🐹 Worker Go: Iniciando...")

	user := getEnv("RABBITMQ_USER", "user")
	pass := getEnv("RABBITMQ_PASS", "password")
	host := getEnv("RABBITMQ_HOST", "rabbitmq")
	port := getEnv("RABBITMQ_PORT", "5672")

	connString := fmt.Sprintf("amqp://%s:%s@%s:%s/", user, pass, host, port)

	conn := connectRabbitMQ(connString)
	defer conn.Close()
	log.Println("✅ Conectado ao RabbitMQ com sucesso!")

	ch, err := conn.Channel()
	onError(err, "Falha ao abrir canal")
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"weather_data", // nome
		true,           // durable
		false,          // delete when unused
		false,          // exclusive
		false,          // no-wait
		nil,            // arguments
	)
	onError(err, "Falha ao declarar fila")

	err = ch.Qos(1, 0, false)
	onError(err, "Falha ao configurar QoS")

	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	onError(err, "Falha ao registrar consumidor")

	forever := make(chan struct{})

	go func() {
		for d := range msgs {
			var data WeatherData
			
			err := json.Unmarshal(d.Body, &data)
			if err != nil {
				log.Printf("JSON Inválido: %s", err)
				continue
			}
			log.Printf("📥 [Recebido] %s | %.1f°C | %s", data.City, data.Temp, data.Description)
		}
	}()

	log.Printf(" [*] Aguardando mensagens na fila '%s'. CTRL+C para sair.", q.Name)
	<-forever
}