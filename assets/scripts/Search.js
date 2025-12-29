import { API } from "./API.js";
import { CurrentWeather } from "./CurrentWeather.js";
import { WeatherComponent } from "./WeatherComponent.js";
import { DailyForcast } from "./DailyForcast.js";
import { HourlyForcast } from "./HourlyForcast.js";

export class Search extends WeatherComponent {
  static #LOCATION_NOT_FOUND = "not_found";
  constructor() {
    super();

    this.searchDropdown = document.querySelector(".search-results");
    this.searchDropdown.addEventListener("click", this.searchResultHandler);

    this.searchBtn = document.querySelector(".search-btn");

    this.searchForm = document.querySelector(".search-container");
    this.searchForm.addEventListener("submit", this.searchBtnHandler);

    document.addEventListener("click", this.closeSearchDropdownHandler);
  }

  async render(lat, lng) {
    CurrentWeather.startLoading();
    DailyForcast.startLoading();
    HourlyForcast.startLoading();

    const api = await API.getInstance(lat, lng);

    const units = localStorage.getItem("current_units");

    new CurrentWeather(api, units);

    new DailyForcast(api, units);

    new HourlyForcast(api, units);
  }

  searchResultHandler = (event) => {
    const searchResult = event.target.closest("p");
    if (!searchResult.classList.contains("search-result")) return;
    this.searchDropdown.classList.remove("show-dropdown");
    const lat = searchResult.dataset.lat;
    const lng = searchResult.dataset.lng;
    sessionStorage.setItem("current_latitude", lat);
    sessionStorage.setItem("current_longitude", lng);
    this.render(lat, lng);
  };

  searchBtnHandler = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const searchInput = document.querySelector(".search-textbox").value;
    if (!searchInput) return;

    const results = await this.getCoordsFromAddress(searchInput);

    const weatherSection = document.querySelector(".weather-section");
    const noSearchResults = document.querySelector(".hidden-no-search-results");

    if (results === Search.#LOCATION_NOT_FOUND) {
      weatherSection.classList.add("hidden-component");
      noSearchResults.classList.add("show-no-search-results");
      noSearchResults.textContent = "No search results found!";
      return;
    }

    if (weatherSection.classList.contains("hidden-component"))
      weatherSection.classList.remove("hidden-component");

    if (noSearchResults.classList.contains("show-no-search-results")) {
      noSearchResults.classList.remove("show-no-search-results");
      noSearchResults.textContent = "";
    }
    this.searchDropdown.textContent = "";
    this.searchDropdown.classList.add("show-dropdown");

    results.forEach((res) => {
      const resultTemplate = document.getElementById("search-result-template");
      const fragment = document.importNode(resultTemplate.content, true);
      const searchResult = fragment.querySelector(".search-result");
      searchResult.textContent = `${res.city ? res.city + ", " : ""}${res.country}`;
      searchResult.dataset.lat = res.lat;
      searchResult.dataset.lng = res.lng;
      this.searchDropdown.append(searchResult);
    });
  };

  closeSearchDropdownHandler = (event) => {
    if (
      this.searchDropdown.classList.contains("show-dropdown") &&
      !this.searchDropdown.contains(event.target) &&
      !this.searchBtn.contains(event.target)
    ) {
      this.searchDropdown.classList.remove("show-dropdown");
      this.searchDropdown.textContent = "";
    }
  };

  async getCoordsFromAddress(address) {
    let data;
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
        address
      )}`;
      const res = await fetch(url);
      data = await res.json();
    } catch (error) {
      throw "couldn't search for location: " + error;
    }
    if (!data[0]) return Search.#LOCATION_NOT_FOUND;
    data = data.map((result) => {
      return {
        lat: result.lat,
        lng: result.lon,
        city: result.address.city || result.address.state,
        country: result.address.country,
      };
    });
    return data.slice(0, 4);
  }
}
