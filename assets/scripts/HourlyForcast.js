import { WeatherComponent } from "./WeatherComponent.js";

export class HourlyForcast extends WeatherComponent {
  constructor(apiInstance, units) {
    super();
    if (units === WeatherComponent.STANDARD_UNITS) {
      this.api = apiInstance.standardData;
    } else {
      this.api = apiInstance.imperialData;
    }
    const daysBtn = document.querySelector(".days-btn");
    daysBtn.addEventListener("click", this.chooseDayHandler);
    document.addEventListener("click", this.closeChooseDayDropdownHandler);
  }

  render() {}

  chooseDayHandler = (event) => {
    event.stopPropagation();

    const dropdown = document.querySelector(".choose-day-dropdown");
    dropdown.classList.toggle("show-dropdown");
  };

  closeChooseDayDropdownHandler = (event) => {
    const daysBtn = document.querySelector(".days-btn");
    const dropdown = document.querySelector(".choose-day-dropdown");
    if (
      dropdown.classList.contains("show-dropdown") &&
      !daysBtn.contains(event.target) &&
      !dropdown.contains(event.target)
    ) {
      dropdown.classList.remove("show-dropdown");
    }
  };
}
