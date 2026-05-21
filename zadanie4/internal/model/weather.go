package model

import "time"

// Weather — model GORM (dane lokalizacji + ostatni odczyt z API).
type Weather struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	City        string    `gorm:"uniqueIndex;not null" json:"city"`
	Latitude    float64   `json:"latitude"`
	Longitude   float64   `json:"longitude"`
	Temperature float64   `json:"temperature"`
	Humidity    int       `json:"humidity"`
	WeatherCode int       `json:"weather_code"`
	Description string    `json:"description"`
	FetchedAt   time.Time `json:"fetched_at"`
}

// LocationSeed — dane startowe (bez odczytu pogody).
type LocationSeed struct {
	City      string
	Latitude  float64
	Longitude float64
}
