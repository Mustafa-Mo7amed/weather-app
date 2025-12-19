import { API } from "./API.js";
import { CurrentWeather } from "./CurrentWeather.js";
import { WeatherComponent } from "./WeatherComponent.js";
import { DailyForcast } from "./DailyForcast.js";
import { HourlyForcast } from "./HourlyForcast.js";

class App {
  constructor() {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const api = await API.getInstance(
          pos.coords.latitude,
          pos.coords.longitude
        );
        console.log(api.standardData);
        console.log(api.imperialData);
        console.log(api.addressData);
        const curr = new CurrentWeather(api, WeatherComponent.STANDARD_UNITS);
        console.log(curr.currentWeather());

        const daily = new DailyForcast(api, WeatherComponent.STANDARD_UNITS);

        const hourly = new HourlyForcast(api, WeatherComponent.STANDARD_UNITS);
      },
      (err) => {
        console.log("Couldn't fetch your location: ", err);
      }
    );
  }
}

new App();
