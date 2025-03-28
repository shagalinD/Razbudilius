package handlers

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"razbudilius/models"
	"razbudilius/storage/postgres"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
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
// @Router /register [post]
func Register(c *gin.Context) {
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
		var errorString string
		switch {
		case errors.Is(err, gorm.ErrDuplicatedKey):
			errorString = fmt.Sprintf("could not create a user: %s", "user already exists")
		default:
			errorString = fmt.Sprintf("could not create a user: %s", err)
		}
		log.Printf("Error creating user: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": errorString})
			return
	}

	// Respond
	c.JSON(http.StatusCreated, gin.H{"message": "User created successfully"})
}

// Login godoc
// @Summary Аутентификация пользователя
// @Description Авторизует пользователя по имени и паролю
// @Tags auth
// @Accept json
// @Produce json
// @Param user body models.User true "Данные для авторизации"
// @Success 200 {object} models.User
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /login [post]
func Login(c *gin.Context)  {
	// Get user's data
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return 
	}

	// Look up requested user
	var foundUser models.User 
	if err := postgres.DB.Where("email = ?", user.Email).First(&foundUser).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	// Compare passwords
	if err := bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(user.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return 
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": foundUser.ID,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": fmt.Sprintf("error on creating jwt token: %s", err),
		})
	}

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("Authorization", tokenString, 3600*24*30, "", "", false, true) //!!!CORRECT FALSE TO TRUE ON PRODUCTION!!!
	// Respond
	c.JSON(http.StatusOK, gin.H{
		"message": "login successful",
	})
}


// GetUser godoc
// @Summary Получение информации о пользователе
// @Description Получает информацию о пользователе на основе токена, сохраненного в куки
// @Tags auth
// @Accept json
// @Produce json
// @Success 200 {object} models.User
// @Failure 401 {object} map[string]string "Unauthorized"
// @Failure 500 {object} map[string]string "Internal Server Error"
// @Router /profile [get]
func Profile(c *gin.Context) {
	user, _ := c.Get("User")

	if user == nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "Token not found",
		})
	}

	fmt.Print("Logged in")

	c.JSON(http.StatusOK, gin.H{
		"data": user,
	})
}