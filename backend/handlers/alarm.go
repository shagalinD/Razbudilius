package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// @Summary Get quest
// @Description Get first step of a new quest
// @Tags Quest
// @Accept  json
// @Produce  json
// @Param dif query string true "Сложность квеста (30s/1m/5m)"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /start_quest [get]
func HandleAlarmStop(c *gin.Context) {
	// Получение настроек сложности из профиля
	difficulty := c.Query("dif")

	if difficulty != "30s" && difficulty != "1m" && difficulty != "5m" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error":"invalid difficulty format (30s, 1m, 5m)",
		})
	}
	
	resp, err := http.Get(
			os.Getenv("PYTHON_SERVICE_URL") + fmt.Sprintf("/start_quest?dif=%s", difficulty),
	)

	if err != nil {
			c.AbortWithStatusJSON(502, gin.H{"error": "quest service unavailable"})
			return
	}

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		c.AbortWithStatusJSON(resp.StatusCode, gin.H{
			"error": fmt.Sprintf("quest service error: %s", string(body)),
		})
		return
	}

	// Обработка ответа
	var questData struct {
			SessionID string `json:"session_id"`
			Content string `json:"content"`
			Status string `json:"status"`
			Progress string `json:"progress"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&questData); err != nil {
			c.AbortWithStatusJSON(500, gin.H{"error": "Invalid response format"})
			return
	}

	// Ответ фронтенду
	c.JSON(200, questData)
}


type QuestRequest struct {
	SessionID string `json:"session_id"`
	UserAnswer string `json:"user_answer"`
}
// @Summary Next step
// @Description Send user's response and get next step of an existring quest
// @Tags Quest
// @Accept  json
// @Produce  json
// @Param Answer body QuestRequest true "Ответ пользователя"
// @Success 200 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /process_answer [post]
func HandleQuestAnswer(c *gin.Context) {
	// Получение настроек сложности из профиля
	var req QuestRequest 

	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error":"error on parsing request",
		})
		return
	}
	
	body, _ := json.Marshal(&req)
	resp, err := http.Post(
			os.Getenv("PYTHON_SERVICE_URL") + "/process_answer",
			"application/json",
			bytes.NewBuffer(body),
	)

	if err != nil {
			c.AbortWithStatusJSON(502, gin.H{"error": "quest service unavailable"})
			return
	}

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		c.AbortWithStatusJSON(resp.StatusCode, gin.H{
			"error": fmt.Sprintf("quest service error: %s", string(body)),
		})
		return
	}

	// Обработка ответа
	var questData struct {
			SessionID string `json:"session_id"`
			Content string `json:"content"`
			Status string `json:"status"`
			Progress string `json:"progress"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&questData); err != nil {
			c.AbortWithStatusJSON(500, gin.H{"error": "Invalid ai response format"})
			return
	}

	// Ответ фронтенду
	c.JSON(200, questData)
}