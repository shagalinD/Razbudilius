package config

import (
	"log"
	"os"
	"time"

	"github.com/ilyakaznacheev/cleanenv"
	"github.com/joho/godotenv"
)

type Config struct {
	Env         string      `yaml:"env" env-default:"local"`
	StoragePath string      `yaml:"storage_path" env-required:"true"`
	HTTPServer              `yaml:"http_server"`
	Database ConfigDatabase `yaml:"database"`
}

type HTTPServer struct {
	Address     string        `yaml:"address" env-default:"localhost:8080"`
	Timeout     time.Duration `yaml:"timeout" env-default:"4s"`
	IdleTimeout time.Duration `yaml:"idle_timeout" env-default:"60s"`
}

type ConfigDatabase struct {
	Port     string `env:"PORT" env-default:"5432"`
	Host     string `env:"HOST" env-default:"localhost"`
	Name     string `env:"NAME" env-default:"postgres"`
	User     string `env:"USER" env-default:"user"`
	Password string `env:"PASSWORD"`
	SSLMode  string `env:"SSLMODE" env-default:"disable"`
}

func MustLoad() *Config{
	err := godotenv.Load()
    if err != nil {
        log.Fatal("Error loading .env file")
    }
		
	 configPath := os.Getenv("CONFIG_PATH") 

	 if configPath == "" {
		log.Fatal("CONFIG_PATH is not set")
	 }

	 if _, err := os.Stat(configPath); os.IsNotExist(err) {
		log.Fatalf("config file does not exit: %s", configPath)
	 }

	 var cfg Config 

	 if err := cleanenv.ReadConfig(configPath, &cfg); err != nil {
		log.Fatalf("cannot read config: %s", err)
	 }

	 return &cfg
}