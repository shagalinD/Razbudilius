package middleware

import (
	"fmt"
	"net/http"
	"os"
	"razbudilius/models"
	"razbudilius/storage/postgres"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func RequireAuth(c *gin.Context) {
	// Get token
	tokenString := c.GetHeader("Authorization")

	if tokenString == ""{
		c.AbortWithStatus(http.StatusUnauthorized)
	}

	// Decode/validate it

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
	
		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return []byte(os.Getenv("SECRET")), nil
	})
	if err != nil {
		c.AbortWithStatus(http.StatusUnauthorized)
	}
	
	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		
		// Check the expiration
		if float64(time.Now().Unix()) > claims["exp"].(float64) {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "access token expired",
			})
		}

		var user models.User 
		if err := postgres.DB.Select("email").First(&user, claims["sub"]).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "invalid token",
			})
		}
		// Attach to reqx
		c.Set("User", gin.H{
			"email": user.Email,
		})
		c.Set("userID", user.ID)
		
		// Continue
		c.Next()
	} else {
		c.AbortWithStatus(http.StatusUnauthorized)
	}
}