import { WeatherComponent } from "./WeatherComponent.js";

export class DailyForcast extends WeatherComponent {
  constructor(apiInstance, units) {
    super();
    if (units == WeatherComponent.STANDARD_UNITS) {
      this.api = apiInstance.standardData;
    } else {
      this.api = apiInstance.imperialData;
    }
    this.daily = this.api.daily;
    this.render();
  }

  render() {
    for (let order = 0; order < 7; ++order) {
      const data = {
        order: order + 1,
        date: this.daily.time[order],
        weathercode: this.daily.weathercode[order],
        max: Math.round(this.daily.temperature_2m_max[order]),
        min: Math.round(this.daily.temperature_2m_min[order]),
      };
      this.renderCard(data);
    }
  }

  renderCard(data) {
    const card = document.querySelector(
      `.daily-forcast-card:nth-child(${data.order})`
    );
    card.querySelector(".day").textContent = this.getDayName(data.date);

    card.querySelector(
      ".daily-forcast-icon"
    ).src = `./assets/images/${this.getWeatherIcon(data.weathercode)}`;

    card.querySelector(".temperature .high").textContent = `${data.max}°`;
    card.querySelector(".temperature .low").textContent = `${data.min}°`;
  }

  getDayName(date) {
    return new Date(date).toLocaleDateString("en-US", { weekday: "short" });
  }
}
