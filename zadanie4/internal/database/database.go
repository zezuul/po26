package database

import (
	"log"

	"pl.po26/zadanie4/internal/model"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func Connect(path string) *gorm.DB {
	db, err := gorm.Open(sqlite.Open(path), &gorm.Config{})
	if err != nil {
		log.Fatalf("baza danych: %v", err)
	}

	if err := db.AutoMigrate(&model.Weather{}); err != nil {
		log.Fatalf("migracja: %v", err)
	}

	return db
}

func SeedLocations(db *gorm.DB, locations []model.LocationSeed) {
	for _, loc := range locations {
		var existing model.Weather
		result := db.Where("city = ?", loc.City).First(&existing)
		if result.Error == gorm.ErrRecordNotFound {
			db.Create(&model.Weather{
				City:        loc.City,
				Latitude:    loc.Latitude,
				Longitude:   loc.Longitude,
				Description: "Brak danych — pobierz przez /api/weather",
			})
		}
	}
}
