const apiKey = "937f7a689a7f864acbb210086a24a975";

function getWeather() {
    const city = document.getElementById("cityInput").value;
    const weatherResult = document.getElementById("weatherResult");
    const forecastContainer = document.getElementById("forecastContainer");
    const loading = document.getElementById("loading");

    if (!city) {
        weatherResult.innerHTML = "<p style='color: red;'>Please enter a city name.</p>";
        return;
    }

    loading.style.display = "block";
    weatherResult.innerHTML = "";
    forecastContainer.innerHTML = "";

    // Weather API (Current)
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    // Forecast API (5 Days)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Fetch Weather Data
    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            loading.style.display = "none";

            if (data.cod === "404") {
                weatherResult.innerHTML = "<p style='color: red;'>City not found. Try again!</p>";
                return;
            }

            const temp = data.main.temp;
            const humidity = data.main.humidity;
            const weather = data.weather[0].main.toLowerCase();
            const description = data.weather[0].description;
            const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

            // Display Main Weather Info
            weatherResult.innerHTML = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <img class="weather-icon" src="${icon}" alt="Weather Icon">
                <p><strong>${weather.charAt(0).toUpperCase() + weather.slice(1)}</strong> - ${description}</p>
                <p><strong>Temperature:</strong> ${temp}°C</p>
                <p><strong>Humidity:</strong> ${humidity}%</p>
                <p><strong>Sunrise:</strong> ${sunrise}</p>
                <p><strong>Sunset:</strong> ${sunset}</p>
            `;
        })
        .catch(error => {
            loading.style.display = "none";
            weatherResult.innerHTML = "<p style='color: red;'>Error fetching weather data.</p>";
        });

    // Fetch 5-Day Forecast Data
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== "200") return;

            const dailyForecasts = {};
            data.list.forEach(entry => {
                const date = new Date(entry.dt * 1000).toDateString();
                if (!dailyForecasts[date]) {
                    dailyForecasts[date] = entry;
                }
            });

            // Limit forecast to 5 days
            const forecastEntries = Object.values(dailyForecasts).slice(0, 5);

            forecastEntries.forEach(entry => {
                const temp = entry.main.temp;
                const icon = `https://openweathermap.org/img/wn/${entry.weather[0].icon}.png`;
                const description = entry.weather[0].description;
                const humidity = entry.main.humidity;
                const rainChance = entry.pop * 100; // Probability of precipitation (%)

                forecastContainer.innerHTML += `
                    <div class="forecast-card">
                        <h4>${new Date(entry.dt * 1000).toLocaleDateString()}</h4>
                        <img class="weather-icon" src="${icon}" alt="Weather Icon">
                        <p>${description}</p>
                        <p><strong>Temp:</strong> ${temp}°C</p>
                        <p><strong>Humidity:</strong> ${humidity}%</p>
                        <p><strong>Rain Chance:</strong> ${rainChance}%</p>
                    </div>
                `;
            });
        })
        .catch(error => {
            console.error("Error fetching forecast data", error);
        });
}

// Enter Key Support
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("cityInput").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            getWeather();
        }
    });
});
