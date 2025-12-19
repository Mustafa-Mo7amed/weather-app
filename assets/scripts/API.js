export class API {
  constructor() {}

  static async getInstance(lat, lng) {
    const instance = new API();
    await instance.#FetchData(lat, lng);
    return instance;
  }

  async #FetchData(lat, lng) {
    if (this.initialized) return;
    this.initialized = true;
    try {
      let params = new URLSearchParams({
        latitude: lat,
        longitude: lng,
        current_weather: true,
        hourly:
          "temperature_2m,precipitation,apparent_temperature,relative_humidity_2m,weathercode",
        daily: "temperature_2m_max,temperature_2m_min,weathercode",
      });

      const WeatherStandardUnitsRequest = fetch(
        `https://api.open-meteo.com/v1/forecast?${params}`
      );

      params = new URLSearchParams({
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

      const WeatherImperialUnitsRequest = fetch(
        `https://api.open-meteo.com/v1/forecast?${params}`
      );

      params = new URLSearchParams({
        format: "json",
        lat: encodeURIComponent(lat),
        lon: encodeURIComponent(lng),
        zoom: 18,
      });

      const AddressRequest = fetch(
        `https://nominatim.openstreetmap.org/reverse?${params}`
      );

      const standardResponse = await WeatherStandardUnitsRequest;
      const imperialResponse = await WeatherImperialUnitsRequest;
      const AddressResponse = await AddressRequest;

      this.standardData = await standardResponse.json();
      this.imperialData = await imperialResponse.json();
      this.addressData = await AddressResponse.json();
    } catch (err) {
      console.log(err);
    }
  }
}
