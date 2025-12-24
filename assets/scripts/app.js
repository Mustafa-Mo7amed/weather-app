import { API } from "./API.js";
import { CurrentWeather } from "./CurrentWeather.js";
import { WeatherComponent } from "./WeatherComponent.js";
import { DailyForcast } from "./DailyForcast.js";
import { HourlyForcast } from "./HourlyForcast.js";
import { Search } from "./Search.js";

class App {
  constructor() {
    // initializing components
    new Search();
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        sessionStorage.setItem("current_latitude", pos.coords.latitude);
        sessionStorage.setItem("current_longitude", pos.coords.longitude);
        this.initComponent(
          pos.coords.latitude,
          pos.coords.longitude,
          WeatherComponent.STANDARD_UNITS
        );
      },
      (err) => {
        throw "Couldn't fetch your location: " + err;
      }
    );
    const unitsBtn = document.querySelector(".units-btn");
    unitsBtn.addEventListener("click", this.unitsHandler);
    document.addEventListener("click", this.closeUnitsDropdownHandler);

    document.addEventListener("click", this.switchUnitsHandler);
  }

  async initComponent(lat, lng, units) {
    const api = await API.getInstance(lat, lng);

    console.log(api.standardData);
    console.log(api.imperialData);
    console.log(api.addressData);

    new CurrentWeather(api, units);

    new DailyForcast(api, units);

    new HourlyForcast(api, units);
  }

  toggleUnitsDropdown() {
    const unitsDropdown = document.querySelector(".units-dropdown");
    unitsDropdown.classList.toggle("show-dropdown");
  }

  switchUnitsHandler = (event) => {
    if (!event.target.matches("#switch-units")) return;

    const isImperial = event.target.dataset.imperial === "true";
    if (isImperial) {
      event.target.textContent = "Switch to Standard";
      event.target.dataset.imperial = "false";
    } else {
      event.target.textContent = "Switch to Imperial";
      event.target.dataset.imperial = "true";
    }

    document
      .querySelectorAll(".dropdown-section button")
      .forEach((btn) => btn.classList.toggle("selected-metric"));

    this.initComponent(
      sessionStorage.getItem("current_latitude"),
      sessionStorage.getItem("current_longitude"),
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
