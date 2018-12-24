var round = Math.round;
var settings = {};
var dayTimer;
var weatherTimer;
var stockTimer;

$(document).ready(function(){
	$.ajax({
		url: "js/settings.json",
		method: "get",
		contentType: "application/json",
		success: function(data){
			settings = data;
			main();
		}
	})
});

function main(){
	getCurrentWeather();
	getForecastWeather();
	getStockData();

	weatherTimer = new Timer([getCurrentWeather, getForecastWeather], settings.weather.refreshRate);
		weatherTimer.start();
	stockTimer = new Timer([getStockData], settings.stocks.refreshRate);
		stockTimer.start();

	dayTimer = new Timer([StartEndDay], 5);
}

function getCurrentWeather(){
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather",
        method: "get",
        data: {
            id: settings.weather.city,
            APPID: settings.weather.api,
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
            id: settings.weather.city,
            APPID: settings.weather.api,
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
		let forecastLowHigh = getForecastLowHigh(forecastData.list.slice(i*8, ((8*(i+1))-1)));
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

	weatherTimer.restart();
}

function getStockData(){
	$('#stocks').empty();
	for(let i = 0; i < 4; i++){
		// Can only get 5 symbols at a time
		let offset = i*5;
		let end = (5*(i+1));
		let symbols = settings.stocks.watching.slice(offset, end).join(',');

		$.ajax({
			url: "https://www.worldtradingdata.com/api/v1/stock",
			method: "get",
			data: {
				symbol: symbols,
				api_token: settings.stocks.api
			},
			success: function(data){
				updateStockDisplay(data.data);
			}
		});
	}
}

function updateStockDisplay(stockData){
	for(let i = 0; i < stockData.length; i++){
		let symbol = stockData[i].symbol;
		let price = Number(stockData[i].price).toFixed(2);
		let change = Number(stockData[i].change_pct).toFixed(2);
		let changeClass = "up";

		let changeSpan = $('<span></span>');
		let stockSpan = $('<span></span>');

		if(Math.abs(change) > 5){
			$(stockSpan).addClass('text-underline');
		}

		if(change != Math.abs(change)){
			change = "v"+Math.abs(change);
			changeClass = "down";
		}else{
			change = "^"+change;
		}

		$(changeSpan).text(" ("+change+"%)");
		$(changeSpan).addClass(changeClass);

		$(stockSpan).text(symbol+": $"+price);
		$(stockSpan).addClass('single-stock');
		$(stockSpan).append(changeSpan);

		$('#stocks').append(stockSpan);
	}
}

function isActiveHours(){
	let now = new Date();
	if(settings.active.days.includes(now.getDay())){
		if(now.getHours() >= settings.active.hours[0] && now.getHours() < settings.active.hours[1]){
			return true;
		}else{
			return false;
		}
	}else{
		return false;
	}
}

function StartEndDay(){
	if(isActiveHours()){
		if(!weatherTimer.isRunning()){
			weatherTimer.start();
		}
		if(!stockTimer.isRunning()){
			stockTimer.start();
		}
	}else{
		weatherTimer.stop();
		stockTimer.stop();
	}
}
