const apiKey = "937f7a689a7f864acbb210086a24a975";

function getWeather() {
    const city = document.getElementById("cityInput").value;
    const weatherResult = document.getElementById("weatherResult");
    const loading = document.getElementById("loading");
    

    if (!city) {
        weatherResult.innerHTML = "<p style='color: red;'>Please enter a city name.</p>";
        return;
    }

    loading.style.display = "block";
    weatherResult.innerHTML = "";

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            loading.style.display = "none";

            if (data.cod === "404") {
                weatherResult.innerHTML = "<p style='color: red;'>City not found. Try again!</p>";
                return;
            }

            const temp = data.main.temp;
            const weather = data.weather[0].main.toLowerCase();
            const description = data.weather[0].description;
            const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const sunrise = new Date(data.sys.sunrise * 1000);
            const sunset = new Date(data.sys.sunset * 1000);
            const currentTime = new Date();

            const isNight = currentTime < sunrise || currentTime > sunset;

            backgroundVideo.load();

            weatherResult.innerHTML = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <img class="weather-icon" src="${icon}" alt="Weather Icon">
                <p><strong>${weather.charAt(0).toUpperCase() + weather.slice(1)}</strong> - ${description}</p>
                <p><strong>Temperature:</strong> ${temp}°C</p>
                <p><strong>Humidity:</strong> ${humidity}%</p>
                <p><strong>Wind Speed:</strong> ${windSpeed} m/s</p>
                <p><strong>Sunrise:</strong> ${sunrise.toLocaleTimeString()}</p>
                <p><strong>Sunset:</strong> ${sunset.toLocaleTimeString()}</p>
            `;
        })
        .catch(error => {
            loading.style.display = "none";
            weatherResult.innerHTML = "<p style='color: red;'>Error fetching weather data.</p>";
        });
}

document.addEventListener("DOMContentLoaded", function() {
    const cityInput = document.getElementById("cityInput");
    cityInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            getWeather();
        }
    });
});
