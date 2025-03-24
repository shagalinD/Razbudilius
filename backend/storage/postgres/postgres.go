package postgres

import (
	"fmt"
	"log"
	"razbudilius/internal/config"
	"razbudilius/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func New(config *config.Config) {
	var err error
	connString := fmt.Sprintf("user=%s password=%s dbname=%s sslmode=%s", config.Database.User, config.Database.Password, config.Database.Name, config.Database.SSLMode)
	DB, err = gorm.Open(postgres.Open(connString), &gorm.Config{})

	if err != nil {
		log.Panic(fmt.Errorf("error connecting to a database: %s", err))
		return 
	}
	
	DB.AutoMigrate(&models.User{})
}