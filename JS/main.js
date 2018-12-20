// city id for Dayton, OH via https://OpenWeatherMap.org
var weatherCityID = 4919553;
var weatherAPI = "d7235563258d3bbb6ba494080319486e";
var stockAPI = "aT12THC6tWcnMvBiI6tSSBrCPQpcwKuSn3cDKjQsunJM1AQPNnJRc9af0e7v";

function getCurrentWeather(){
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather",
        method: "get",
        data: {
            id: weatherCityID,
            APPID: weatherAPI,
            units: "imperial"
        },
        success: function(data){
            console.log(data);
            updateWeatherDisplay(data);
        },
        error: function(data){
            let response = JSON.parse(data.responseText);
            console.log(response.message);
        }
    });
}

function updateWeatherDisplay(weatherData){
    let round = Math.round;
    // Update current temp
    $('#currentTemp').text(round(weatherData.main.temp));
    // Update current low
    $('#currentLow').text(round(weatherData.main.temp_min));
    // Update current high
    $('#currentHigh').text(round(weatherData.main.temp_max));

    // Find current weather image
    let image = "";
    switch(weatherData.weather[0].main){
        case "Clouds":
            image = "partial-cloudy-night";
            break;
    }

    // Update current weatehr image
    $('#currentIcon').attr("src", "images/"+image+".png");
}
