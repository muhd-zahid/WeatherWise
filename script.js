const apiKey = "cf58960d71954798829949b19386327c";
const apiBase = "https://api.openweathermap.org/data/2.5";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherCard = document.getElementById("weatherCard");
const cityName = document.getElementById("cityName");
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const feelsLike = document.getElementById("feelsLike");
const forecastSection = document.getElementById("forecastSection");
const forecastContainer = document.getElementById("forecastContainer");
const errorMessage = document.getElementById("errorMessage");

const weatherEmojis = {
    "Clear": "☀️",
    "Clouds": "☁️",
    "Rain": "🌧️",
    "Drizzle": "🌦️",
    "Thunderstorm": "⛈️",
    "Snow": "❄️",
    "Mist": "🌫️",
    "Fog": "🌫️",
    "Haze": "🌫️"
};

function getWeatherEmoji(condition) {
    return weatherEmojis[condition] || "🌤️";
}

function getDayName(dateString) {
    const date = new Date(dateString);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
}

async function getWeather(city) {
    try {
        hideAll();

        const weatherUrl = `${apiBase}/weather?q=${city}&appid=${apiKey}&units=metric`;
        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            showError();
            return;
        }

        const weatherData = await weatherResponse.json();

        cityName.textContent = weatherData.name + ", " + weatherData.sys.country;
        temperature.textContent = Math.round(weatherData.main.temp) + "°C";
        description.textContent = weatherData.weather[0].description;
        humidity.textContent = weatherData.main.humidity + "%";
        windSpeed.textContent = Math.round(weatherData.wind.speed * 3.6) + " km/h";
        feelsLike.textContent = Math.round(weatherData.main.feels_like) + "°C";
        weatherIcon.textContent = getWeatherEmoji(weatherData.weather[0].main);

        weatherCard.style.display = "block";

        const forecastUrl = `${apiBase}/forecast?q=${city}&appid=${apiKey}&units=metric`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();

        forecastContainer.innerHTML = "";

        const dailyForecasts = {};

        forecastData.list.forEach(item => {
            const date = item.dt_txt.split(" ")[0];
            if (!dailyForecasts[date]) {
                dailyForecasts[date] = item;
            }
        });

        const forecastDays = Object.values(dailyForecasts).slice(1, 6);

        forecastDays.forEach(day => {
            const dayCard = document.createElement("div");
            dayCard.className = "forecast-item";
            dayCard.innerHTML = `
                <div class="forecast-day">${getDayName(day.dt_txt)}</div>
                <div class="forecast-icon">${getWeatherEmoji(day.weather[0].main)}</div>
                <div class="forecast-temp">${Math.round(day.main.temp)}°C</div>
            `;
            forecastContainer.appendChild(dayCard);
        });

        forecastSection.style.display = "block";

    } catch (error) {
        showError();
    }
}

function hideAll() {
    weatherCard.style.display = "none";
    forecastSection.style.display = "none";
    errorMessage.style.display = "none";
}

function showError() {
    errorMessage.style.display = "block";
}

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city !== "") {
        getWeather(city);
    }
});

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city !== "") {
            getWeather(city);
        }
    }
});