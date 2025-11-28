package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

const API_URL = "http://backend:3000/weather"

type WeatherData struct {
	City        string  	`json:"city"`
	Temp        float64 	`json:"temp"`
	FeelsLike   float64 	`json:"feels_like"`
	Humidity    int     	`json:"humidity"`
	Description string  	`json:"description"`
	Timestamp   int64   	`json:"collected_at"` 
    Pressure    float64 `json:"pressure,omitempty"`
    WindSpeed   float64 `json:"wind_speed,omitempty"`
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

func failOnError(err error, msg string) {
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

func sendToAPI(data WeatherData) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		log.Printf("❌ Erro JSON: %v", err)
		return
	}

	resp, err := http.Post(API_URL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		log.Printf("❌ Erro API (%s): %v", API_URL, err)
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusCreated || resp.StatusCode == http.StatusOK {
		log.Printf("✅ [API] Dados salvos com sucesso! (%s)", data.City)
	} else {
		log.Printf("⚠️ [API] Erro: NestJS retornou %d", resp.StatusCode)
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
	log.Println("✅ Conectado ao RabbitMQ!")

	ch, err := conn.Channel()
	failOnError(err, "Falha ao abrir canal")
	defer ch.Close()

	q, err := ch.QueueDeclare("weather_data", true, false, false, false, nil)
	failOnError(err, "Falha ao declarar fila")

	err = ch.Qos(1, 0, false)
	failOnError(err, "QoS falhou")

	msgs, err := ch.Consume(q.Name, "", true, false, false, false, nil)
	failOnError(err, "Consume falhou")

	forever := make(chan struct{})

	go func() {
		for d := range msgs {
			var data WeatherData
			
			err := json.Unmarshal(d.Body, &data)
			if err != nil {
				log.Printf("❌ JSON Inválido: %s", err)
				continue
			}

	
			log.Printf("📥 [Fila] Processando: %s | %.1f°C", data.City, data.Temp)
			
	
			sendToAPI(data)
		}
	}()

	log.Printf(" [*] Worker rodando. Destino API: %s", API_URL)
	<-forever
}