export class WeatherComponent {
    static STANDARD_UNITS = "STANDARD";
    static IMPERIAL_UNITS = "IMPERIAL";
  render() {}

  getWeatherIcon(weatherCode) {
    if (weatherCode === 0 || weatherCode === 1) return "icon-sunny.webp";
    if (weatherCode === 2 || weatherCode === 3)
      return "icon-partly-cloudy.webp";
    if (weatherCode === 45 || weatherCode === 48) return "icon-fog.webp";
    if ([51, 53, 55, 56, 57].includes(weatherCode)) return "icon-drizzle.webp";
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode))
      return "icon-rain.webp";
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return "icon-snow.webp";
    if ([95, 96, 99].includes(weatherCode)) return "icon-storm.webp";
    return "icon-partly-cloudy.webp";
  }
}
