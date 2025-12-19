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
    card.querySelector(".day").textContent = this.getDay(data.date);

    card.querySelector(
      ".daily-forcast-icon"
    ).src = `./assets/images/${this.getWeatherIcon(data.weathercode)}`;

    // TODO: innerHTML to handel &deg; (search for other ways)
    card.querySelector(".temperature .high").innerHTML = `${data.max}&deg;`;
    card.querySelector(".temperature .low").innerHTML = `${data.min}&deg;`;
  }

  getDay(date) {
    return new Date(date).toLocaleDateString("en-US", { weekday: "short" });
  }
}
