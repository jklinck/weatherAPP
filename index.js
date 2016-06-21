/*
The API keys used below (openWeatherAPI and nytAPI) are located in the apiKeys.js file
which I have added to the .gitignore file so they aren't exposed on GitHub.
*/

$(function(){
	var latitude;
	var longitude;
	var request;
	var city;
	var farenheit;
	var celsius;
	var kelvin;
	var main;
	var description;
	var GEOCODING;
	var nytHeaderElem = $('#nytimes-header');
	var body = $('body');
	var icon;

	navigator.geolocation.getCurrentPosition(success,error);

	function success(position){
		latitude=position.coords.latitude;
		longitude=position.coords.longitude;
		request='http://api.openweathermap.org/data/2.5/weather?lat='+latitude+'&lon='+longitude+'&APPID='+openWeatherAPI;
		geoCoding = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + '%2C' + longitude + '&language=en';
		gMaps();
	} 

	function error(){
		$("#city").html("Please use a different browser than Chrome or allow location tracking.");
	}
	
	// Open Weather Map API
	function openWeather(){
			$.ajax({
					url:request,
					dataType:"jsonp",
					success:function(data){
						icon=data.weather[0].icon;
						picture="url(http://openweathermap.org/img/w/"+icon+".png)";
						description=data.weather[0].description;
						kelvin=data.main.temp;
						celsius=(kelvin-273.15).toFixed(1);
						farenheit=(1.8*(kelvin-273)+32).toFixed(1);
						$("#cityState").html(city+", "+state);
						$("#country").html(country);
						$("#weather").html(farenheit+"&#176 F");
						$("#description").html(description);
						$(".icon").css({"background-image":picture});
					} 
				}) 
	}
	// New York Times API
	function nyt(){
		 var nytUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?&q='+city+','+state+'&page=0&api-key='+nytAPI;
		    $.getJSON(nytUrl).done(function(data){
		        var articles=[];
		        $.each(data.response.docs,function(key){
		            articles.push("<a target='_blank' href="+"'"+data.response.docs[key].web_url+"'"+"><h3>"+data.response.docs[key].headline.main+"</h3></a><p>"+data.response.docs[key].snippet+"</p>");
		        });
		        $("<ul>",{
		            "class": "article-list",
		            html: articles.join("")
		        }).appendTo(body);
			    }).error(function(){
			        $(nytHeaderElem).text("New York Times articles could not be loaded.");
			    });
	}
	// Google Maps API
	function gMaps(){
		$.getJSON(geoCoding).done(function(location) {
            	country = location.results[0].address_components[6].short_name;
            	state = location.results[0].address_components[5].long_name;
            	city = location.results[0].address_components[3].long_name;
            	openWeather(); 
				nyt();  
            })  
	}


	// toggle between Farenheit and Celsius
	var isClicked = false;
	$('#weather').click(function() {
		if (isClicked == false) {
			$(this).html(celsius+"&#176 C");
			isClicked = true;
		}
		else {
			$(this).html(farenheit+"&#176 F");
			isClicked = false;
		}
	});
});







