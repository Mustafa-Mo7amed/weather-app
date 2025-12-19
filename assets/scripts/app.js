import { API } from "./API.js";
import { CurrentWeather } from "./CurrentWeather.js";
import { WeatherComponent } from "./WeatherComponent.js";
import { DailyForcast } from "./DailyForcast.js";
import { HourlyForcast } from "./HourlyForcast.js";

class App {
  constructor() {
    this.initializeAPI(WeatherComponent.STANDARD_UNITS);
    const unitsBtn = document.querySelector(".units-btn");
    unitsBtn.addEventListener("click", this.unitsHandler);
    document.addEventListener("click", this.closeUnitsDropdownHandler);

    document.addEventListener("click", this.switchUnitsHandler);
  }

  initializeAPI(units) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const api = await API.getInstance(
          pos.coords.latitude,
          pos.coords.longitude
        );
        console.log(api.standardData);
        console.log(api.imperialData);
        console.log(api.addressData);
        new CurrentWeather(api, units);

        new DailyForcast(api, units);

        new HourlyForcast(api, units);
      },
      (err) => {
        console.log("Couldn't fetch your location: ", err);
      }
    );
  }

  toggleUnitsDropdown() {
    const unitsDropdown = document.querySelector(".units-dropdown");
    unitsDropdown.classList.toggle("show-dropdown");
  }

  switchUnitsHandler = (event) => {
    if (!event.target.matches("#switch-units")) return;

    const isImperial = event.target.textContent.includes("Imperial");

    event.target.textContent = isImperial
      ? "Switch to Standard"
      : "Switch to Imperial";

    document
      .querySelectorAll(".dropdown-section button")
      .forEach((btn) => btn.classList.toggle("selected-metric"));

    this.initializeAPI(
      isImperial
        ? WeatherComponent.IMPERIAL_UNITS
        : WeatherComponent.STANDARD_UNITS
    );

    document.querySelector(".units-dropdown").classList.remove("show-dropdown");
  };

  unitsHandler = (event) => {
    event.stopPropagation();
    this.toggleUnitsDropdown();
  };

  closeUnitsDropdownHandler = (event) => {
    const btn = document.querySelector(".units-btn");
    const dropdown = document.querySelector(".units-dropdown");
    if (
      dropdown.classList.contains("show-dropdown") &&
      !btn.contains(event.target) &&
      !dropdown.contains(event.target)
    ) {
      dropdown.classList.remove("show-dropdown");
    }
  };
}

new App();
