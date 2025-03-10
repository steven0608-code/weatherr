//api key para makuha yung data sa openweather API
const apiKey = "937f7a689a7f864acbb210086a24a975";


//value ng city input para sa ididisplay na weather data

function getWeather() {
    const city = document.getElementById("cityInput").value;
    const weatherResult = document.getElementById("weatherResult");
    const forecastContainer = document.getElementById("forecastContainer");
    const loading = document.getElementById("loading");


    
    if (!city) {
        weatherResult.innerHTML = "<p style='color: red;'>Please enter a city name.</p>";
        return;
    }


    //loading indicator
    loading.style.display = "block";
    weatherResult.innerHTML = "";
    forecastContainer.innerHTML = "";


    //present weather
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    //5 day 
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    //para makuha yung weather data para sa api
    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            
            //matatanggal pag nakuha na yung data
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

         //update para makita ang present weather
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


    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== "200") return;


            //Kinukuha ang forecast data at tinitignan kung valid ito.
            const dailyForecasts = {};
            data.list.forEach(entry => {
                const date = new Date(entry.dt * 1000).toDateString();
                if (!dailyForecasts[date]) {
                    dailyForecasts[date] = entry;
                }
            });

          
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


document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("cityInput").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            getWeather();
        }
    });
});
