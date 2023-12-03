let weatherHomePage = document.getElementById("weatherHomePage")
let weatherDataFetchPage = document.getElementById("weatherDataFetchPage")
let weatherApiBtn = document.getElementById("weatherApiBtn")
let weatherDetails = document.getElementById("weatherDetails")
let googleMap = document.getElementById("googleMap")
let latlong = document.getElementById("latlong")
let latitude ;
let longitude;
const loader = document.getElementById('loader');

// event listeners 

weatherApiBtn.addEventListener('click', async function () {
    try {
        console.log('hey');
        loader.style.display = "block"
        weatherHomePage.style.display = "none"
        const [latitude, longitude] = await getLocation();
        await fetchWeather(latitude,longitude)
        
        console.log('lat is ', latitude, 'long is ', longitude);
    } catch (error) {
        console.error(error);
    }
});




// functions

async function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    resolve([latitude, longitude]);

                },
                function (error) {
                    loader.style.display = "none"
                    reject(`Error getting location: ${error.message}`);
                }
            );
        } else {
            reject('Geolocation is not supported by this browser.');
        }
    });
}

async function fetchWeather(latitude, longitude) {
    const apiKey = 'd98545f0f7353474e088052a64fb92fc'; 
    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}` ;
    try {           
        console.log("hey 2");
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log('Weather Data:', data);

        const city = data.timezone.split('/').pop()
        const windSpeed = data.current.wind_speed;
        const humidity = data.current.humidity;
        const timeZone = data.timezone;
        const pressure = data.current.pressure;
        const windDirection = data.current.wind_deg;
        const uvIndex = data.current.uvi;
        const feelsLike = data.current.feels_like;

       let weatherDetailsObj = {
            "Location" : city,
            "Wind Speed" : windSpeed,
            "Humidity" : humidity,
            "Time Zone" : timeZone,
            "Pressure" : pressure,
            "Wind Direction" : windDirection,
            "UV Index" : uvIndex,
            "Feels Like" : feelsLike,
       }

        getWeatherDetails(weatherDetailsObj);

        latlong.innerHTML = `
            <div>Lat : ${latitude}</div>
            <div>Long : ${longitude}</div>
        `
        googleMap.innerHTML= `
            <iframe
                src="https://maps.google.com/maps?q=${latitude}, ${longitude}&z=15&output=embed"
                frameborder="0"
                style="border: 0"
                ></iframe>
        `

        console.log(
            city+"\n"+
            windSpeed + "\n"+
            humidity + "\n"+
            timeZone + "\n"+
            pressure + "\n"+
            windDirection + "\n"+
            uvIndex + "\n"+
            feelsLike );  

            loader.style.display = "none"
        weatherDataFetchPage.style.display = "block"
        
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
    }
}

function getWeatherDetails(weatherDetailsObj){
    weatherDetails.style.display = "flex"
    Object.keys(weatherDetailsObj).forEach( key => {
        let element = `<div>${key} : ${weatherDetailsObj[key]}</div>`
        weatherDetails.innerHTML += element;
    })
}