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

  async render() {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    for (let order = 0; order < 7; ++order) {
      const data = {
        order: order + 1,
        date: this.daily.time[order],
        weathercode: this.daily.weathercode[order],
        max: Math.round(this.daily.temperature_2m_max[order]),
        min: Math.round(this.daily.temperature_2m_min[order]),
      };
      this.renderCard(data);
      await sleep(50);
    }
  }

  renderCard(data) {
    const card = document.querySelector(
      `.daily-forcast-card:nth-child(${data.order})`
    );

    this.finishedLoading(card);

    card.querySelector(".day").textContent = this.getDayName(data.date);

    card.querySelector(
      ".daily-forcast-icon"
    ).src = `./assets/images/${this.getWeatherIcon(data.weathercode)}`;

    card.querySelector(".temperature .high").textContent = `${data.max}°`;
    card.querySelector(".temperature .low").textContent = `${data.min}°`;
  }

  static startLoading() {
    const cards = document.querySelectorAll(".daily-forcast-card");
    cards.forEach((card) => {
      card.classList.add("hidden-while-loading");
      card.classList.remove("shown-after-loading");
    });
  }

  finishedLoading = (card) => {
    card.classList.remove("hidden-while-loading");
    card.classList.add("shown-after-loading");
  };

  getDayName(date) {
    return new Date(date).toLocaleDateString("en-US", { weekday: "short" });
  }
}
