/*like in all documentations it only works with the http not https*/

var app = angular.module('WeatherApp', []);  //defines the app

app.factory('WeatherApi', function($http) {
    var obj = {};

    obj.getLoc = function() { //getting the ip/current location
        return $http.jsonp("http://ip-api.com/json/?callback=JSON_CALLBACK");
    };
    obj.getCurrent = function(city) { //getting the weather data via city
        var api = "http://api.openweathermap.org/data/2.5/weather?q=";
        var units = "&units=metric";
        var appid = "&APPID=061f24cf3cde2f60644a8240302983f2"
        var cb = "&callback=JSON_CALLBACK";

        return $http.jsonp(api + city + units + appid + cb); //get our location via http pull
    };
    return obj
});

app.controller('MainCtrl', function($scope, WeatherApi) { //MainController handles the basic
    $scope.city = "test2323";
    $scope.Data = {};
    $scope.Data.unit = 'C';
    $scope.Data.sysChange = false;
    WeatherApi.getLoc().success(function(data) {  //get current location

        var city = data.city + ',' + data.country;
        $scope.Data.city = data.city;
        $scope.Data.country = data.country;
        $scope.Data.regionName = data.regionName;
        WeatherApi.getCurrent(city).success(function(data) {  //get data from the openweatherapi
            CurrentWeather(data)
        });
    });

    function CurrentWeather(data) {   //current weather data get
        $scope.Data.temp = Math.round(data.main.temp);  //variable for the html override
        $scope.Data.temp_min = Math.round(data.wind.speed); //windspeed
        $scope.Data.desc = data.weather[0].description; //weather description
        $scope.Data.Cel = Math.round(data.main.temp);   //celsius temp
        $scope.Data.Fah = Math.round((data.main.temp * 9) / 5 + 32);  //fahrenheit temp
        $scope.Data.des = data.weather[0].main;
        return IconGen($scope.Data.des);
    }

    function IconGen(city) {    //switch between icons weather specific
        var city = city.toLowerCase() //just transforms everything to lowercase letters
        switch (city) {            //all weather options which are on the api openweathermap
            case 'drizzle':
                addIcon(city)
                changeBackground('DarkGrey');
                break;
            case 'clouds':
                addIcon(city)
                changeBackground('LightSlateGrey ');
                break;
            case 'rain':
                addIcon(city)
                changeBackground('CornflowerBlue');
                break;
            case 'snow':
                addIcon(city)
                changeBackground('White');
                break;
            case 'clear':
                addIcon(city)
                changeBackground('PaleGoldenRod');
                break;
            case 'thunderstorm':
                addIcon(city)
                changeBackground('DarkBlue');
                break;
            default:
                $('div.clouds').removeClass('hide');
        }
    }

    function changeBackground(color) {
        document.body.style.background = color;
    }

    function addIcon(city) {    //removes the hide class of the defined weathercondition in div
        $('div.' + city).removeClass('hide');
    }

    $scope.Data.sys = function() {    //change between C and fahrenheit when clicked
        if ($scope.Data.sysChange) {
            $scope.Data.unit = 'C';
            $scope.Data.temp = $scope.Data.Cel;
            return $scope.Data.sysChange = false;
        }
        $scope.Data.unit = 'F';
        $scope.Data.temp = $scope.Data.Fah;
        return $scope.Data.sysChange = true;
    }

});/**
 * Created by Jayant on 5/3/2016.
 */
