import { WeatherComponent } from "./WeatherComponent.js";

export class CurrentWeather extends WeatherComponent {
  constructor(apiInstance, units) {
    super();
    this.units = units;
    if (units == WeatherComponent.STANDARD_UNITS) {
      this.api = apiInstance.standardData;
    } else {
      this.api = apiInstance.imperialData;
    }
    this.addressApi = apiInstance.addressData;
    this.render();
  }

  render() {
    this.finishedLoading(document.querySelector(".current-weather"));
    this.hideDotsLoader();

    const currentWeather = this.currentWeather();

    const dateEl = document.querySelector(".date");
    dateEl.textContent = this.getFormatedDate();

    const locationEl = document.querySelector(".location");
    locationEl.textContent = `${currentWeather.city}, ${currentWeather.country}`;

    const degreeEl = document.querySelector(".temperature-degree span");
    degreeEl.textContent = currentWeather.temperature;

    const weatherIconEl = document.querySelector(".current-weather-icon");
    weatherIconEl.src = `./assets/images/${this.getWeatherIcon(
      currentWeather.weathercode
    )}`;

    const feelsLikeEl = document.querySelector(".feels-like");
    const humidityEl = document.querySelector(".humidity .metric-value");
    const windEl = document.querySelector(".wind");
    const precipitationEl = document.querySelector(".precipitation");

    feelsLikeEl.querySelector(".metric-value").textContent =
      currentWeather.weather_metrics.feels_like;
    feelsLikeEl.querySelector(".degree-symbol").textContent = "°";
    humidityEl.textContent = currentWeather.weather_metrics.humidity + "%";
    windEl.querySelector(".metric-value").textContent =
      currentWeather.weather_metrics.windspeed;
    windEl.querySelector(".metric-unit").textContent =
      this.units == WeatherComponent.IMPERIAL_UNITS ? "mph" : "km/h";
    precipitationEl.querySelector(".metric-value").textContent =
      currentWeather.weather_metrics.precipitation;
    precipitationEl.querySelector(".metric-unit").textContent =
      this.units == WeatherComponent.IMPERIAL_UNITS ? "in" : "mm";
  }

  finishedLoading = (element) => {
    element.classList.remove("hidden-while-loading");
    element.classList.add("shown-after-loading");
    element.classList.add("show-background-image");
  };

  hideDotsLoader = () => {
    const dots = document.querySelector(".dots-loader");
    dots.classList.add("display-none");
  };

  currentWeather() {
    const curHourIdx = this.getNearestHourIndex();
    return {
      temperature: Math.round(this.api.current_weather.temperature),
      weathercode: this.api.current_weather.weathercode,
      country: this.addressApi.address.country,
      city: this.addressApi.address.city || this.addressApi.address.state,
      date: this.api.current_weather.time,
      weather_metrics: {
        feels_like: Math.round(
          this.api.hourly.apparent_temperature[curHourIdx]
        ),
        humidity: this.api.hourly.relative_humidity_2m[curHourIdx],
        precipitation: this.api.hourly.precipitation[curHourIdx],
        windspeed: this.api.current_weather.windspeed,
      },
    };
  }

  getNearestHourIndex() {
    const now = new Date();
    const times = this.api.hourly.time;
    let nearestIndex = 0;
    let minDiff = Infinity;
    for (let i = 0; i < times.length; ++i) {
      const hourDate = new Date(times[i]);
      const diff = Math.abs(hourDate - now);

      if (diff < minDiff) {
        minDiff = diff;
        nearestIndex = i;
      }
    }
    return nearestIndex;
  }

  getFormatedDate() {
    const date = new Date(this.api.current_weather.time);
    const day = date.toLocaleDateString("en-US", { weekday: "long" });
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const monthDay = date.getDate();
    const year = date.getFullYear();
    return `${day}, ${month} ${monthDay}, ${year}`;
  }
}
