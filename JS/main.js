let round = Math.round;
// city id for Dayton, OH via https://OpenWeatherMap.org
var weatherTimer = null;
var weatherRefreshRate = (60*1000)*15; // 15 minutes
var weatherCityID = 4919553;
var weatherAPI = "d7235563258d3bbb6ba494080319486e";
var stockAPI = "aT12THC6tWcnMvBiI6tSSBrCPQpcwKuSn3cDKjQsunJM1AQPNnJRc9af0e7v";

$(document).ready(function(){
	getCurrentWeather();
	getForecastWeather();
	
	weatherTimer = setInterval(function(){
		getCurrentWeather();
		getForecastWeather();
	}, weatherRefreshRate);
});

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
            updateCurrentDisplay(data);
        },
        error: function(data){
            let response = JSON.parse(data.responseText);
            console.log(response.message);
        }
    });
}

function getForecastWeather(){
	$.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast",
        method: "get",
        data: {
            id: weatherCityID,
            APPID: weatherAPI,
            units: "imperial"
        },
        success: function(data){
			updateForecastDisplay(data)
        },
        error: function(data){
            let response = JSON.parse(data.responseText);
            console.log(response.message);
        }
    });
}

function updateCurrentDisplay(weatherData){
	
	// Update updated time
	let now = new Date();
	$('#updatedWhen').text("Updated: "+now.toLocaleTimeString());
	// Update city name display
	$('#weatherCity').text(weatherData.name);
    // Update current temp
    $('#currentTemp').text(round(weatherData.main.temp));
    // Update current low
    $('#currentLow').text(round(weatherData.main.temp_min));
    // Update current high
    $('#currentHigh').text(round(weatherData.main.temp_max));

    // Find current weather image
    let image = getWeatherImage(weatherData.weather[0].id, weatherData.sys.sunrise*1000, weatherData.sys.sunset*1000);

    // Update current weather image
    $('#currentIcon').attr("src", "images/"+image+".png");
}

function updateForecastDisplay(forecastData){
	var desiredForecast = [forecastData.list[4], forecastData.list[12], forecastData.list[20]];
	
	for(let i = 0; i < 3; i++){
		// Update forecast date display
		let forecastDate = new Date(desiredForecast[i].dt*1000);
		$('#forecast'+(i+1)+' .forecast-date').text((forecastDate.getMonth()+1)+"/"+forecastDate.getDate());
		// Update forecast low/high
		let forecastLowHigh = getForecastLowHigh(forecastData.list.slice(i, ((8*(i+1))-1)));
		$('#forecast'+(i+1)+' .forecast-low').text(forecastLowHigh[0]);
		$('#forecast'+(i+1)+' .forecast-high').text(forecastLowHigh[1]);
		// Update forecast icon 
		let image = getWeatherImage(desiredForecast[i].weather[0].id);
		$('#forecast'+(i+1)+' .forecast-icon').attr("src", "images/"+image+".png");
	}
}

function getForecastLowHigh(weatherData){
	let lowHigh = [999, -999]; // [low, high]
	for(let i = 0; i < weatherData.length; i++){
		if(weatherData[i].main.temp_min < lowHigh[0]){
			lowHigh[0] = weatherData[i].main.temp_min;
		}
		if(weatherData[i].main.temp_max > lowHigh[1]){
			lowHigh[1] = weatherData[i].main.temp_max;
		}
	}
	
	lowHigh[0] = round(lowHigh[0]);
	lowHigh[1] = round(lowHigh[1]);
	
	return lowHigh;
}

function getWeatherImage(weatherID, sunrise = null, sunset = null){
	let image = "";
	let weatherTime = getWeatherTime(sunrise, sunset);
    if(weatherID >= 801){ // Clouds
		image = "partial-cloudy-"+weatherTime;
		if(weatherID == 804){
			image = "cloudy";
		}
    }
	else if(weatherID >= 600 && weatherID < 700){ // Snow
		if(weatherID != 602 && weatherID == 622){
			image = "snow-light";
		}else{
			image = "snow-heavy";
		}
	}
	else if(weatherID >= 500 && weatherID < 600){ // Rain
		image = "rain";
	}
	else if(weatherID >= 300 && weatherID < 400){ // Drizzle
		image = "drizzle";
	}
	else if(weatherID >= 200 && weatherID < 300){ // Thunderstorm
		image = "thunderstorms";
	}
	else if(weatherID == 741 || weatherID == 721 || weatherID == 701){ // Fog
		image = "foggy-"+weatherTime;
	}
	else{
		image = "clear-"+weatherTime;
	}
	
	return image;
}

function getWeatherTime(sunrise, sunset){
	if(!sunrise || !sunset){
		return "day";
	}
	if(Date.now() < sunrise || Date.now() > sunset){
		return "night";
	}else{
		return "day";
	}
}

function refreshWeatherDisplay(){
	getCurrentWeather();
	getForecastWeather();
	
	clearInterval(weatherTimer);
	weatherTimer = setInterval(function(){
		getCurrentWeather();
		getForecastWeather();
	}, weatherRefreshRate);
}
