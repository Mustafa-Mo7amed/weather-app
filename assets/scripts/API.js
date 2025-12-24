export class API {
  constructor() {
    this.standardData = null;
    this.imperialData = null;
    this.addressData = null;
  }

  static async getInstance(lat, lng) {
    const instance = new API();
    await instance.#fetchData(lat, lng);
    return instance;
  }

  async #fetchData(lat, lng) {
    const weatherBaseURL = "https://api.open-meteo.com/v1/forecast";
    const addressBaseURL = "https://nominatim.openstreetmap.org/reverse";

    const standardParams = new URLSearchParams({
      latitude: lat,
      longitude: lng,
      current_weather: true,
      hourly:
        "temperature_2m,precipitation,apparent_temperature,relative_humidity_2m,weathercode",
      daily: "temperature_2m_max,temperature_2m_min,weathercode",
    });

    const imperialParams = new URLSearchParams({
      latitude: lat,
      longitude: lng,
      current_weather: true,
      hourly:
        "temperature_2m,precipitation,apparent_temperature,relative_humidity_2m,weathercode",
      daily: "temperature_2m_max,temperature_2m_min,weathercode",
      temperature_unit: "fahrenheit",
      wind_speed_unit: "mph",
      precipitation_unit: "inch",
    });

    const addressParams = new URLSearchParams({
      format: "json",
      lat: lat,
      lon: lng,
      zoom: 18,
    });

    try {
      const [standardResponse, imperialResponse, addressResponse] =
        await Promise.all([
          fetch(`${weatherBaseURL}?${standardParams}`),
          fetch(`${weatherBaseURL}?${imperialParams}`),
          fetch(`${addressBaseURL}?${addressParams}`, {
            headers: {
              "User-Agent": "weather-app (mostaamohamedd985@gmail.com)",
            },
          }),
        ]);

      if (!standardResponse.ok || !imperialResponse.ok || !addressResponse.ok)
        throw new Error(`Network error`);

      this.standardData = await standardResponse.json();
      this.imperialData = await imperialResponse.json();
      this.addressData = await addressResponse.json();
    } catch (err) {
      console.log("API error: ", err);
      throw err;
    }
  }
}
