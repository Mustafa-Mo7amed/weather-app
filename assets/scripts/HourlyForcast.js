import { WeatherComponent } from "./WeatherComponent.js";

export class HourlyForcast extends WeatherComponent {
  constructor(apiInstance, units) {
    super();
    if (units === WeatherComponent.STANDARD_UNITS) {
      this.api = apiInstance.standardData;
    } else {
      this.api = apiInstance.imperialData;
    }

    this.daysBtn = document.querySelector(".days-btn");
    const dropdown = document.querySelector(".choose-day-dropdown");
    dropdown.addEventListener("click", this.dropdownHandler);
    this.daysBtn.addEventListener("click", this.chooseDayHandler);
    document.addEventListener("click", this.closeChooseDayDropdownHandler);

    const dates = this.api.hourly.time;
    const temps = this.api.hourly.temperature_2m;
    const codes = this.api.hourly.weathercode;
    this.days = [];
    let lastDay = -1;
    for (let i = 0; i < dates.length; ++i) {
      const curDate = new Date(dates[i]);
      const dayNumber = curDate.getDay();
      if (dayNumber != lastDay) {
        this.days.push([]);
        lastDay = dayNumber;
      }
      this.days.at(-1).push({
        weathercode: codes[i],
        date: dates[i],
        temperature: temps[i],
      });
    }

    this.daysBtn.querySelector("span").textContent = this.getDayName(
      this.days[0][0].date
    );
    this.render(0);
  }

  render(index) {
    const day = this.days[index];
    const cards = document.querySelectorAll(".hourly-forcast-card");
    for (let i = 0; i < cards.length; ++i) {
      const card = cards[i];
      card.querySelector(
        ".hourly-forcast-icon"
      ).src = `./assets/images/${this.getWeatherIcon(day[i].weathercode)}`;
      card.querySelector(".hour").textContent = this.getFormattedTime(
        day[i].date
      );
      card.querySelector(".degree").textContent =
        Math.round(day[i].temperature) + "°";
    }
  }

  renderDropdown() {
    const dropdownBtns = document.querySelectorAll(".choose-day-btn");
    for (let i = 0; i < dropdownBtns.length; ++i) {
      dropdownBtns[i].textContent = this.getDayName(this.days[i][0].date);
      dropdownBtns[i].id = i;
    }
  }

  chooseDayHandler = (event) => {
    event.stopPropagation();

    const dropdown = document.querySelector(".choose-day-dropdown");
    dropdown.classList.toggle("show-dropdown");

    this.renderDropdown();
  };

  closeChooseDayDropdownHandler = (event) => {
    const dropdown = document.querySelector(".choose-day-dropdown");
    if (
      dropdown.classList.contains("show-dropdown") &&
      !this.daysBtn.contains(event.target) &&
      !dropdown.contains(event.target)
    ) {
      dropdown.classList.remove("show-dropdown");
    }
  };

  dropdownHandler = (event) => {
    const btn = event.target.closest("button");
    if (!btn) return;
    const idx = Number(btn.dataset.index);
    this.render(idx);
    event.currentTarget.classList.toggle("show-dropdown");

    this.daysBtn.querySelector("span").textContent = this.getDayName(
      this.days[idx][0].date
    );
  };

  getDayName(date) {
    return new Date(date).toLocaleDateString("en-US", { weekday: "long" });
  }

  getFormattedTime(dateString) {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      hour12: true,
    });
  }
}
