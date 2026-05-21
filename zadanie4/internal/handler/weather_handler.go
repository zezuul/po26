package handler

import (
	"net/http"
	"strings"
	"time"

	"pl.po26/zadanie4/internal/model"
	"pl.po26/zadanie4/internal/proxy"

	"github.com/labstack/echo/v4"
	"gorm.io/gorm"
)

type WeatherHandler struct {
	db    *gorm.DB
	proxy *proxy.WeatherProxy
}

func NewWeatherHandler(db *gorm.DB, weatherProxy *proxy.WeatherProxy) *WeatherHandler {
	return &WeatherHandler{db: db, proxy: weatherProxy}
}

type weatherRequest struct {
	Cities []string `json:"cities"`
}

// GetWeather GET /api/weather?cities=Warszawa,Kraków,Gdańsk
func (h *WeatherHandler) GetWeather(c echo.Context) error {
	citiesParam := c.QueryParam("cities")
	if citiesParam == "" {
		citiesParam = c.QueryParam("city")
	}
	if citiesParam == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Podaj parametr cities (np. ?cities=Warsaw,Krakow) lub city",
		})
	}

	cities := splitCities(citiesParam)
	return h.fetchAndRespond(c, cities)
}

// PostWeather POST /api/weather  body: {"cities":["Warszawa","Kraków"]}
func (h *WeatherHandler) PostWeather(c echo.Context) error {
	var req weatherRequest
	if err := c.Bind(&req); err != nil || len(req.Cities) == 0 {
		return c.JSON(http.StatusBadRequest, map[string]string{
			"error": "Body JSON: {\"cities\": [\"Warsaw\", \"Krakow\"]}",
		})
	}
	return h.fetchAndRespond(c, req.Cities)
}

func (h *WeatherHandler) fetchAndRespond(c echo.Context, cities []string) error {
	results := make([]model.Weather, 0, len(cities))
	errors := make(map[string]string)

	for _, city := range cities {
		weather, err := h.fetchCity(city)
		if err != nil {
			errors[city] = err.Error()
			continue
		}
		results = append(results, *weather)
	}

	response := map[string]interface{}{
		"count":   len(results),
		"weather": results,
	}
	if len(errors) > 0 {
		response["errors"] = errors
	}

	if len(results) == 0 {
		return c.JSON(http.StatusNotFound, response)
	}

	return c.JSON(http.StatusOK, response)
}

func (h *WeatherHandler) fetchCity(city string) (*model.Weather, error) {
	var record model.Weather
	if err := h.db.Where("city = ?", city).First(&record).Error; err != nil {
		return nil, err
	}

	data, err := h.proxy.Fetch(record.Latitude, record.Longitude)
	if err != nil {
		return nil, err
	}

	record.Temperature = data.Temperature
	record.Humidity = data.Humidity
	record.WeatherCode = data.WeatherCode
	record.Description = data.Description
	record.FetchedAt = time.Now()

	if err := h.db.Save(&record).Error; err != nil {
		return nil, err
	}

	return &record, nil
}

func splitCities(raw string) []string {
	parts := strings.Split(raw, ",")
	cities := make([]string, 0, len(parts))
	for _, p := range parts {
		p = strings.TrimSpace(p)
		if p != "" {
			cities = append(cities, p)
		}
	}
	return cities
}
