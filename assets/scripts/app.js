import { API } from "./API.js";
import { CurrentWeather } from "./CurrentWeather.js";
import { WeatherComponent } from "./WeatherComponent.js";

class App {
  constructor() {
    this.getPos()
      .then(async (pos) => {
        const api = await API.getInstance(pos.coords.latitude, pos.coords.longitude);
        console.log(api.standardData);
        console.log(api.imperialData);
        console.log(api.addressData);
        const curr = new CurrentWeather(api, WeatherComponent.STANDARD_UNITS);
        console.log(curr.CurrentWeather());
      })
      .catch((err) => {
        console.log("Couldn't fetch your location: ", err);
      });
  }

  getPos() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve(pos);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
}

new App();
