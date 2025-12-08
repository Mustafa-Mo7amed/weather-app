import { WeatherComponent } from "./WeatherComponent.js";

export class CurrentWeather extends WeatherComponent {
  constructor(apiInstance, units) {
    super();
    if (units == WeatherComponent.STANDARD_UNITS) {
      this.api = apiInstance.standardData;
    } else {
      this.api = apiInstance.imperialData;
    }
    this.addressApi = apiInstance.addressData;
  }

  render() {}

  CurrentWeather() {
    const curHourIdx = this.GetNearestHourIndex();
    console.log("nearest_time", this.api.hourly.time[curHourIdx]);
    return {
      temperature: this.api.current_weather.temperature,
      weathercode: this.api.current_weather.weathercode,
      country: this.addressApi.address.country,
      city: this.addressApi.address.state,
      date: this.api.current_weather.time,
      weather_metrics: {
        feels_like: this.api.hourly.apparent_temperature[curHourIdx],
        humidity: this.api.hourly.relative_humidity_2m[curHourIdx],
        precipitation: this.api.hourly.precipitation[curHourIdx],
        windspeed: this.api.current_weather.windspeed,
      },
    };
  }

  GetNearestHourIndex() {
    const iso = new Date().toISOString();
    const date = iso.slice(0, 16);
    const times = this.api.hourly.time;
    let l = 0;
    let r = times.length - 1;
    let res = times.length - 1;
    while (l <= r) {
      const mid = (l + r) >> 1;
      if (times[mid] >= date) { // compare using integers not strings
        r = mid - 1;
        res = mid;
      } else {
        l = mid + 1;
      }
    }
    return res;
  }
}
