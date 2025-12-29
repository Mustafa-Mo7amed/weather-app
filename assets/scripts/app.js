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
    const curLat = sessionStorage.getItem("current_latitude");
    const curLng = sessionStorage.getItem("current_longitude");
    const curUnits = localStorage.getItem("current_units");
    if (!curLat || !curLng || !curUnits) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          sessionStorage.setItem("current_latitude", pos.coords.latitude);
          sessionStorage.setItem("current_longitude", pos.coords.longitude);
          localStorage.setItem(
            "current_units",
            WeatherComponent.STANDARD_UNITS
          );
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
    } else {
      this.initComponent(curLat, curLng, curUnits);
    }
    const unitsBtn = document.querySelector(".units-btn");
    unitsBtn.addEventListener("click", this.unitsHandler);
    document.addEventListener("click", this.closeUnitsDropdownHandler);

    document.addEventListener("click", this.switchUnitsHandler);
  }

  async initComponent(lat, lng, units) {
    let api = null;
    try {
      CurrentWeather.startLoading();
      DailyForcast.startLoading();
      HourlyForcast.startLoading();
      
      api = await API.getInstance(lat, lng);
    } catch (err) {
      this.renderApiError();
      return;
    }
    console.log(api.standardData);
    console.log(api.imperialData);
    console.log(api.addressData);

    new CurrentWeather(api, units);

    new DailyForcast(api, units);

    new HourlyForcast(api, units);
  }

  flipArrowIcon(arrow) {
    arrow.classList.toggle('flipped-arrow');
  }

  toggleUnitsDropdown() {
    const unitsDropdown = document.querySelector(".units-dropdown");
    unitsDropdown.classList.toggle("show-dropdown");
    this.flipArrowIcon(document.querySelector(".units-btn img:last-child"));
  }

  switchUnitsHandler = (event) => {
    if (!event.target.matches("#switch-units")) return;

    if (localStorage.getItem("current_units") === WeatherComponent.STANDARD_UNITS) {
      event.target.textContent = "Switch to Standard";
      localStorage.setItem("current_units", WeatherComponent.IMPERIAL_UNITS);
    } else {
      event.target.textContent = "Switch to Imperial";
      localStorage.setItem("current_units", WeatherComponent.STANDARD_UNITS);
    }

    document
      .querySelectorAll(".dropdown-section button")
      .forEach((btn) => btn.classList.toggle("selected-metric"));

    this.initComponent(
      sessionStorage.getItem("current_latitude"),
      sessionStorage.getItem("current_longitude"),
      localStorage.getItem("current_units")
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
      this.flipArrowIcon(btn.querySelector('img:last-child'));
    }
  };

  renderApiError() {
    const heading = document.querySelector(".heading-primary");
    const searchSection = document.querySelector(".search-section");
    const weatherSection = document.querySelector(".weather-section");

    heading.classList.add("display-none");
    searchSection.classList.add("display-none");
    weatherSection.classList.add("display-none");

    const template = document.getElementById("api-error-template");
    const fragment = document.importNode(template.content, true);

    const retryBtn = fragment.querySelector(".retry-btn");
    retryBtn.addEventListener(
      "click",
      () => {
        window.location.reload();
      },
      {
        once: true,
      }
    );

    document.querySelector(".container").appendChild(fragment);
  }
}

new App();
