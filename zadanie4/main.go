package main

import (
	"log"
	"net/http"

	"pl.po26/zadanie4/internal/database"
	"pl.po26/zadanie4/internal/handler"
	"pl.po26/zadanie4/internal/model"
	"pl.po26/zadanie4/internal/proxy"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	db := database.Connect("zadanie4.db")

	// Nazwy bez polskich znaków — bez problemów z PowerShell/curl na demo
	locations := []model.LocationSeed{
		{City: "Warsaw", Latitude: 52.2297, Longitude: 21.0122},
		{City: "Krakow", Latitude: 50.0647, Longitude: 19.9450},
		{City: "Gdansk", Latitude: 54.3520, Longitude: 18.6466},
		{City: "Wroclaw", Latitude: 51.1079, Longitude: 17.0385},
		{City: "Poznan", Latitude: 52.4064, Longitude: 16.9252},
	}
	database.SeedLocations(db, locations)

	weatherProxy := proxy.NewWeatherProxy()
	weatherHandler := handler.NewWeatherHandler(db, weatherProxy)

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/", func(c echo.Context) error {
		return c.JSON(http.StatusOK, map[string]interface{}{
			"service": "zadanie4 — Echo Weather Proxy",
			"endpoints": map[string]string{
				"GET":  "/api/weather?cities=Warsaw,Krakow,Gdansk",
				"POST": "/api/weather  {\"cities\":[\"Warsaw\",\"Krakow\"]}",
			},
			"locations_seeded": []string{"Warsaw", "Krakow", "Gdansk", "Wroclaw", "Poznan"},
		})
	})

	e.GET("/api/weather", weatherHandler.GetWeather)
	e.POST("/api/weather", weatherHandler.PostWeather)

	log.Println("Serwer: http://localhost:8082")
	e.Logger.Fatal(e.Start(":8082"))
}
