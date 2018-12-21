var round = Math.round;
var minute = 60*1000;
var settings = {};
var testStocks = {"symbols_requested":3,"symbols_returned":3,"data":[{"symbol":"AMD","name":"Advanced Micro Devices, Inc.","currency":"USD","price":"17.36","price_open":"18.12","day_high":"18.34","day_low":"17.17","52_week_high":"34.14","52_week_low":"9.04","day_change":"-0.58","change_pct":"-3.21","close_yesterday":"17.94","market_cap":"17299734636","volume":"55283258","shares":"999407000","stock_exchange_long":"NASDAQ Stock Exchange","stock_exchange_short":"NASDAQ","timezone":"EST","timezone_name":"America/New_York","gmt_offset":"-18000","last_trade_time":"2018-12-21 12:38:47"},{"symbol":"EGO","name":"Eldorado Gold Corp","currency":"USD","price":"0.59","price_open":"0.61","day_high":"0.63","day_low":"0.59","52_week_high":"1.47","52_week_low":"0.55","day_change":"-0.02","change_pct":"-2.88","close_yesterday":"0.61","market_cap":"471642519","volume":"1506643","shares":"794011000","stock_exchange_long":"New York Stock Exchange","stock_exchange_short":"NYSE","timezone":"EST","timezone_name":"America/New_York","gmt_offset":"-18000","last_trade_time":"2018-12-21 12:29:45"},{"symbol":"MILN","name":"GLB X FUNDS/MILLENNIALS THEMATIC ET","currency":"USD","price":"19.20","price_open":"19.68","day_high":"19.68","day_low":"19.20","52_week_high":"23.96","52_week_low":"18.84","day_change":"-0.27","change_pct":"1.40","close_yesterday":"19.47","market_cap":"NA","volume":"7031","shares":"1500000","stock_exchange_long":"NASDAQ Stock Exchange","stock_exchange_short":"NASDAQ","timezone":"EST","timezone_name":"America/New_York","gmt_offset":"-18000","last_trade_time":"2018-12-21 12:06:53"}]}
var weatherTimer = null;
var stockTimer = null;

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

	weatherTimer = setInterval(function(){
		getCurrentWeather();
		getForecastWeather();
	}, minute*settings.weather.refreshRate);

	stockTimer = setInterval(function(){
		getStockData();
	}, minute*settings.stocks.refreshRate);
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

	clearInterval(weatherTimer);
	weatherTimer = setInterval(function(){
		getCurrentWeather();
		getForecastWeather();
	}, minute*settings.weather.refreshRate);
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
