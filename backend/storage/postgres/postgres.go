package postgres

import (
	"fmt"
	"razbudilius/internal/config"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func New(config *config.Config) (*gorm.DB, error) {
	connString := fmt.Sprintf("user=%s password=%s dbname=%s sslmode=%s", config.Database.Name, config.Database.Password, config.Database.Name, config.Database.SSLMode)
	db, err:= gorm.Open(postgres.Open(connString), &gorm.Config{})

	if err != nil {
		return nil, fmt.Errorf("%s: %w", "storage.postgres.new", err)
	}

	return db, nil
}