package proxy

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// WeatherProxy — wzorzec Proxy: pobiera dane pogody z zewnętrznego API (Open-Meteo).
type WeatherProxy struct {
	client  *http.Client
	baseURL string
}

func NewWeatherProxy() *WeatherProxy {
	return &WeatherProxy{
		client:  &http.Client{Timeout: 15 * time.Second},
		baseURL: "https://api.open-meteo.com/v1/forecast",
	}
}

type externalResponse struct {
	Current struct {
		Temperature   float64 `json:"temperature_2m"`
		Humidity      int     `json:"relative_humidity_2m"`
		WeatherCode   int     `json:"weather_code"`
	} `json:"current"`
}

type ProxyResult struct {
	Temperature float64
	Humidity    int
	WeatherCode int
	Description string
}

func (p *WeatherProxy) Fetch(latitude, longitude float64) (*ProxyResult, error) {
	url := fmt.Sprintf(
		"%s?latitude=%.4f&longitude=%.4f&current=temperature_2m,relative_humidity_2m,weather_code",
		p.baseURL, latitude, longitude,
	)

	resp, err := p.client.Get(url)
	if err != nil {
		return nil, fmt.Errorf("proxy HTTP: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("proxy status: %d", resp.StatusCode)
	}

	var data externalResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, fmt.Errorf("proxy JSON: %w", err)
	}

	code := data.Current.WeatherCode
	return &ProxyResult{
		Temperature: data.Current.Temperature,
		Humidity:    data.Current.Humidity,
		WeatherCode: code,
		Description: weatherDescription(code),
	}, nil
}

func weatherDescription(code int) string {
	descriptions := map[int]string{
		0:  "Bezchmurnie",
		1:  "Prawie bezchmurnie",
		2:  "Częściowe zachmurzenie",
		3:  "Pochmurno",
		45: "Mgła",
		48: "Szronowa mgła",
		51: "Lekka mżawka",
		61: "Lekki deszcz",
		63: "Umiarkowany deszcz",
		65: "Silny deszcz",
		71: "Lekki śnieg",
		80: "Przelotne opady",
		95: "Burza",
	}
	if d, ok := descriptions[code]; ok {
		return d
	}
	return fmt.Sprintf("Kod pogody: %d", code)
}
