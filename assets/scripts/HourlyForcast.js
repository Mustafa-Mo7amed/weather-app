import { WeatherComponent } from "./WeatherComponent.js";

export class HourlyForcast extends WeatherComponent {
  static previousEvents = null;
  constructor(apiInstance, units) {
    super();
    if (units === WeatherComponent.STANDARD_UNITS) {
      this.api = apiInstance.standardData;
    } else {
      this.api = apiInstance.imperialData;
    }

    this.daysBtn = document.querySelector(".days-btn");
    const dropdown = document.querySelector(".choose-day-dropdown");

    if (HourlyForcast.previousEvents) {
      HourlyForcast.previousEvents.forEach((event) =>
        event.element.removeEventListener(event.type, event.handler)
      );
    }

    HourlyForcast.previousEvents = [];

    HourlyForcast.previousEvents.push({
      element: dropdown,
      type: "click",
      handler: this.dropdownHandler,
    });

    HourlyForcast.previousEvents.push({
      element: this.daysBtn,
      type: "click",
      handler: this.chooseDayHandler,
    });

    HourlyForcast.previousEvents.push({
      element: document,
      type: "click",
      handler: this.closeChooseDayDropdownHandler,
    });

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

    const curDayName = sessionStorage.getItem("current_day_name");
    const curDayIndex = parseInt(sessionStorage.getItem("current_day_index"));
    if (!curDayName) {
      const dayName = this.getDayName(this.days[0][0].date);
      this.daysBtn.querySelector("span").textContent = dayName;

      sessionStorage.setItem("current_day_name", dayName);
      sessionStorage.setItem("current_day_index", 0);
      this.render(0);
    } else {
      this.daysBtn.querySelector("span").textContent = curDayName;
      this.render(curDayIndex);
    }
  }

  async render(index) {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

      this.finishedLoading(card);
      await sleep(50);
    }
  }

  renderDropdown() {
    const dropdownBtns = document.querySelectorAll(".choose-day-btn");
    for (let i = 0; i < dropdownBtns.length; ++i) {
      dropdownBtns[i].textContent = this.getDayName(this.days[i][0].date);
      dropdownBtns[i].id = i;
    }
  }

  static startLoading() {
    const cards = document.querySelectorAll(".hourly-forcast-card");
    cards.forEach((card) => {
      card.classList.add("hidden-while-loading");
      card.classList.remove("shown-after-loading");
    });
  }

  finishedLoading = (element) => {
    element.classList.remove("hidden-while-loading");
    element.classList.add("shown-after-loading");
  };

  flipArrowIcon(arrow) {
    arrow.classList.toggle("flipped-arrow");
  }

  chooseDayHandler = (event) => {
    event.stopPropagation();

    const dropdown = document.querySelector(".choose-day-dropdown");
    dropdown.classList.toggle("show-dropdown");
    this.flipArrowIcon(this.daysBtn.querySelector('img'));

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
      this.flipArrowIcon(this.daysBtn.querySelector("img"));
    }
  };

  dropdownHandler = (event) => {
    const btn = event.target.closest("button");
    if (!btn) return;
    const idx = Number(btn.dataset.index);
    this.render(idx);
    event.currentTarget.classList.toggle("show-dropdown");

    const dayName = this.getDayName(this.days[idx][0].date);
    this.daysBtn.querySelector("span").textContent = dayName;

    sessionStorage.setItem("current_day_name", dayName);
    sessionStorage.setItem("current_day_index", idx);
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
