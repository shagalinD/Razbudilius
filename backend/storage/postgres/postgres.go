package postgres

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Storage struct {
	db *gorm.DB
}

func New(storagePath string) (*Storage, error) {
	db, err:= gorm.Open(postgres.Open(storagePath), &gorm.Config{})

	if err != nil {
		return nil, fmt.Errorf("%s: %w", "storage.postgres.new", err)
	}

	return &Storage{db}, nil
}