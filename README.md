(Due to technical issues, the search service is temporarily unavailable.)

```markdown
# Razbudilius 🔧

Бэкенд-сервис для регистрации пользователей, аутентификации и управления профилями с использованием Go, GORM и JWT.

## 📖 О проекте

Проект предоставляет RESTful API для:

- Регистрации новых пользователей
- Аутентификации через JWT
- Управления профилями пользователей
- Интерактивной документации через Swagger UI

## 🚀 Быстрый старт

### Предварительные требования

- Go 1.16+
- PostgreSQL (или другая СУБД, поддерживаемая GORM)

### Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/yourusername/razbudilius.git
cd razbudilius/backend
```

2. Установите зависимости:
```bash
go mod tidy
```

3. Настройте подключение к БД (задайте переменные окружения в `.env`)

4. Запустите сервер:
```bash
go run .
```

Сервер будет доступен по адресу: http://localhost:8080

## 📚 API Документация

Интерактивная документация доступна через Swagger UI:  
[http://localhost:8080/swagger/index.html](http://localhost:8080/swagger/index.html)

## 🛠 Эндпоинты API

### Регистрация пользователя
**URL:** `POST /Register`

**Тело запроса:**
```json
{
  "username": "exampleUser",
  "password": "examplePassword"
}
```

### Аутентификация
**URL:** `POST /Login`

**Тело запроса:**
```json
{
  "username": "exampleUser",
  "password": "examplePassword"
}
```

**Ответ:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Получение профиля
**URL:** `GET /Profile`

**Заголовки:**
```
Authorization: Bearer <ваш_jwt_токен>
```

## 🧩 Зависимости

Основные используемые пакеты:
- [GORM](https://gorm.io/) - ORM для работы с БД
- [Gin](https://gin-gonic.com/) - Веб-фреймворк
- [Swag](https://github.com/swaggo/swag) - Генерация Swagger документации

Полный список зависимостей в `go.mod`

## 🤝 Участие в проекте

Приветствуются пул-реквесты и сообщения о проблемах. Перед внесением изменений:
1. Создайте форк репозитория
2. Создайте ветку для вашей фичи (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add some amazing feature'`)
4. Запушьте изменения (`git push origin feature/amazing-feature`)
5. Откройте пул-реквест


**Автор:** shagalinD 
📧 Контакты: [shagalin.dmitri@gmail.com](shagalin.dmitri@gmail.com)
```
