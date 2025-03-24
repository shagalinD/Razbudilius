package main

import (
	_ "razbudilius/docs"
	handlers "razbudilius/handlers"
	"razbudilius/internal/config"
	"razbudilius/middleware"
	"razbudilius/storage/postgres"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title Razbudilius API
// @version 1.0
// @description API для управления пользователями
// @host localhost:8080
// @BasePath /

func main() {
	config := config.MustLoad()
	postgres.New(config)

	router := gin.Default()

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	router.POST("/register", handlers.Register)
	router.POST("/login", handlers.Login)
	router.GET("/profile", middleware.RequireAuth, handlers.Profile)

	router.Run(":8080")
}
