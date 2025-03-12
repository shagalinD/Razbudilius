package main

import (
	"log"
	handlers "razbudilius/hanglers"
	"razbudilius/internal/config"
	"razbudilius/models"
	"razbudilius/storage/postgres"

	"github.com/gin-gonic/gin"
)

func main() {
	config := config.MustLoad()
	db, err := postgres.New(config)

	if err != nil {
		log.Fatal("Error on accessing database")
		return
	}

	router := gin.Default()
	db.AutoMigrate(&models.User{})

	router.GET("/register", handlers.Register(db))
	router.GET("/auth", handlers.Login(db))
}
