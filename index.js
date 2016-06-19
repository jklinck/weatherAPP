/*
The API keys used below (openWeatherAPI and nytAPI) are located in the apiKeys.js file
which I have added to the .gitignore file so they aren't exposed on GitHub.
*/

$(function(){
	var date = new Date();
	var time = Number(date.getTime());
	time /= Math.pow(10,3);
	/* 
	the UNIX time that date.getTime() is rendering has 3 more digits than the sunrise 
	and sunset dates from the open weather API, the line above moves the decimal 3 
	places to the left to account for this
	*/
	var sunrise;
	var sunset;
	var nightOrDay;
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
		GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + '%2C' + longitude + '&language=en';
		
		$.getJSON(GEOCODING).done(function(location) {
            	country = location.results[0].address_components[6].short_name;
            	state = location.results[0].address_components[5].long_name;
            	city = location.results[0].address_components[3].long_name;
            	$.ajax({
					url:request,
					dataType:"jsonp",
					success:function(data){
						sunrise=Number(data.sys.sunrise);
						sunset=Number(data.sys.sunset);
						//main=data.weather[0].main;
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
					} // closes success callback from $.ajax
				}) // closing $.ajax
			// NYT API
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
            })  // closing $.getJSON(GEOCODING)
	} // end of success function

	function error(){
		$("#city").html("Please use a different browser than Chrome or allow location tracking.");
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







