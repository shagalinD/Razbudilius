package handlers

import (
	"fmt"
	"log"
	"net/http"
	"razbudilius/models"
	"razbudilius/storage/postgres"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// Singup godoc
// @Summary Регистрация нового пользователя
// @Description Регистрирует нового пользователя с указанным именем и паролем
// @Tags auth
// @Accept json
// @Produce json
// @Param user body models.User true "Данные пользователя"
// @Success 201 {object} models.User
// @Failure 400 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /signup [post]
func Signup(c *gin.Context) {
	//Get a new user's data
	var user models.User

	if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)

	if err != nil {
			log.Printf("Error hashing password: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not hash password"})
			return
	}

	// Create a user 
	user.Password = string(hashedPassword)

	if err := postgres.DB.Create(&user).Error; err != nil {
		log.Printf("Error creating user: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("could not create a user: %s", err)})
			return
	}

	// Respond
	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
}

// Signin godoc
// @Summary Авторизация пользователя
// @Description Авторизует пользователя по имени и паролю
// @Tags auth
// @Accept json
// @Produce json
// @Param user body models.User true "Данные для авторизации"
// @Success 200 {object} models.User
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /signin [post]
func Signin(c *gin.Context)  {
	// Get user's data
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return 
	}

	// Find in database
	var foundUser models.User 
	if err := postgres.DB.Where("username = ?", user.Username).First(&foundUser).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Compare passwords
	if err := bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(user.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return 
	}

	// Respond
	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"user": gin.H{
			"username": foundUser.Username,
			"email": foundUser.Email,
		},
	})
}