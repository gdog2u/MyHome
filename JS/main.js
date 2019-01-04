var round = Math.round;
var settings = {};
var dayTimer;
var taskTimer;
var lastTaskHash;
var weatherTimer;
var stockTimer;

/** General Use Functions */
$(document).ready(function(){
	$.ajax({
		url: "JS/settings.json",
		method: "get",
		contentType: "application/json",
		success: function(data){
			settings = data;
			main();
		}
	})
});

function main(){
	setCSS(settings.general.css);
	getTaskData();
	getCurrentWeather();
	getForecastWeather();
	getStockData();

	taskTimer = new Timer([getTaskData], settings.tasks.refreshRate);
		taskTimer.start();
	weatherTimer = new Timer([getCurrentWeather, getForecastWeather], settings.weather.refreshRate);
		weatherTimer.start();
	stockTimer = new Timer([getStockData], settings.stocks.refreshRate);
		stockTimer.start();

	dayTimer = new Timer([StartEndDay], 5);
}

function setCSS(settings){
	$('#wrapper').css({
		"background": settings.background,
		"background-size": "contain",
		"color": settings.color
	});
}

function isActiveHours(){
	let now = new Date();
	if(settings.general.active.days.includes(now.getDay())){
		if(now.getHours() >= settings.general.active.hours[0] && now.getHours() < settings.general.active.hours[1]){
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
/** Task Functions*/
function getTaskData(){
	$.ajax({
		url: "ajax.php",
		method: "post",
		data: {
			func: "getTasks"
		},
		success: function(data){
			if(data.responseCode == 200 && data.responseData.hash != lastTaskHash){
				lastTaskHash = data.responseData.hash;
				updateTaskDisplay(data.responseData.tasks);
			}else if(data.responseCode != 200){
				console.log(data.responseCode);
				console.log(data.responseData);
			}
		},
		error: function(xhrStatus){
			console.log(xhrStatus);
		}
	});
}

function updateTaskDisplay(taskData){
	$('#list').empty();

	if(taskData.length == 0){
		let task = $('<div></div>');
			$(task).addClass('task');
		let text = $('<span></span>');
			$(text).text("There are currently no tasks.");

		$(task).append(text);
		$('#list').append(task);
	}

	for(let i = 0; i < taskData.length; i++){
		// task holder
		let task = $("<div></div>");
			$(task).attr({
				id: "task_"+taskData[i].TaskID
			});
			$(task).addClass("task");

		// completed checkbox
		let checkbox = $('<input />');
			$(checkbox).attr({
				type: "checkbox",
				id: "task_"+taskData[i].TaskID+"_check"
			});
			$(checkbox).on("change", {id: taskData[i].TaskID}, completeTask);
			if(taskData[i].ParentID > 0){
				$(checkbox).attr("data-parent", taskData[i].ParentID);
			}
			$(checkbox).addClass("check");

		// checkbox label
		let label = $("<label></label>");
			$(label).attr({
				for: "task_"+taskData[i].TaskID+"_check"
			});

		let text = $("<span></span>");
			$(text).text(taskData[i].Task);

		// delete task button
		let remove = $('<span></span>');
			$(remove).on("click", {id: taskData[i].TaskID}, deleteTask);
			$(remove).html("&times;");

		// build the task div
		$(task).append(checkbox, label, text, remove);

		// add the task to the list or to its parent
		if(taskData[i].ParentID > 0){
			$('#task_'+taskData[i].ParentID).removeClass('task');
			$('#task_'+taskData[i].ParentID).addClass('task-parent');
			$('#task_'+taskData[i].ParentID).append(task);
		}else{
			$('#list').append(task);
		}
	}
}

function completeTask(task){
	if(typeof(task) !== "number"){
		task = task.data.id;
	}

	$.ajax({
		url: "/ajax.php",
		method: "post",
		data: {
			func: "completeTask",
			taskID: task
		},
		success: function(data){
			if(data.responseCode == 200){
				$('#task_'+task).addClass("deleted");
				$('#task_'+task).find('[data-parent="'+task+'"]').prop("checked", true);
				setTimeout(function(){
					refreshTaskDisplay();
				}, 1000);
			}else{
				console.log(data.responseCode);
				console.log(data.responseData);
			}
		}
	});
}

function deleteTask(task){
	if(typeof(task) !== "number"){
		task = task.data.id;
	}

	$.ajax({
		url: "/ajax.php",
		method: "post",
		data: {
			func: "deleteTask",
			taskID: task
		},
		success: function(data){
			if(data.responseCode == 200){
				$('#task_'+task).addClass("deleted");
				setTimeout(function(){
					refreshTaskDisplay();
				}, 1000);
			}else{
				console.log(data.responseCode);
				console.log(data.responseData);
			}
		}
	});
}

function refreshTaskDisplay(){
	getTaskData();

	taskTimer.restart();
}

/** Weather Functions*/
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
	var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	for(let i = 0; i < 3; i++){
		// Update forecast date display
		let forecastDate = new Date(desiredForecast[i].dt*1000);
		$('#forecast'+(i+1)+' .forecast-day').text(days[forecastDate.getDay()]);
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

/** Stock functions */
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
