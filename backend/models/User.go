package models

import (
	"time"
)

// User represents a user model
// @Description User model
type User struct {
  ID        uint      `json:"-" gorm:"primaryKey"`
  CreatedAt time.Time `json:"-"`
  UpdatedAt time.Time `json:"-"`
  DeletedAt time.Time `json:"-"`
  Password  string    `json:"password" gorm:"not null" example:"12345678"`
  Email     string    `json:"email" gorm:"unique;not null" example:"testuser@example.com"`
}