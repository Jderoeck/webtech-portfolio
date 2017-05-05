class Weather {
  constructor(options) {
    //logt in console waar iets gebeurt
    console.info("We are in the constructor!");

    // set default values
    this.weather = {};
    this.zalando = {};
    this.latitude = "";
    this.longitude = "";
    this.apiKey = options.apikey;

    this.init();
  }

  init() {
    console.info("the init function kicks things of!");
    this.getMyLocation();
  }

  getMyLocation() {
    var that = this; // deze this verwijst naar de classe weather
    console.info("getting Location!");
    // zoek coördinaten
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log(position);
      that.latitude = position.coords.latitude;
      that.longitude = position.coords.longitude;
      that.getWeather();
    });
  }

  getWeather() {
    var that = this;
    console.info("getting weather data!");
    // get request to https://api.darksky.net/forecast/[key]/[latitude],[longitude]
    const call = `https://api.darksky.net/forecast/${this.apiKey}/${this.latitude},${this.longitude}?units=ca`;
    //console.log(call);

    //make ajax call
    $.ajax({
      method: "GET",
      url: call,
      dataType: "jsonp" //jsonp is een cheat methode om data uit niet open source pagina's te halen? !!!!vraag hens voor meer uitleg!!!!
    }).done(function (response) {
      console.log(response); //response is je resultaat (kijk in console naar wat je nodig hebt.)
      that.weather = response.currently; // currently is een mapje in je response

      that.getClothes();
    });
  }

  getClothes() {
    var that = this;
    console.info("getting right clothing for weather.");

    if (Math.round(this.weather.humidity) > 5) {
      var call = `https://api.zalando.com/articles/UR622H01P-N11`;
      //console.log(call);
    } else if (Math.round(this.weather.apparentTemperature) < 10) {
      var call = `https://api.zalando.com/articles/2NA22S02N-C11`;
    }
    else{
      var call = `https://api.zalando.com/articles/4BE22O02B-K11`;
    }
    $.ajax({
      method: "GET",
      url: call,
      dataType: ""
    }).done(function (response) {
      console.log(response);
      that.zalando = response;

      that.updateUI();
    });
  }


  updateUI() {
    console.info("updating UI");
    var color;
    if (this.weather.temperature < 15) {
      color = "#2980b9";
    } else {
      color = "#e67e22";
    }
    $("#app").css("background-color", color);

    $(".temp").text(`${Math.round(this.weather.temperature)}°C`);
    $(".temp").append(`<p>gevoels temp = ${Math.round(this.weather.apparentTemperature)}°C</p>`)
      .append(`<p>wind snelheid = ${Math.round(this.weather.windSpeed)} km/h</p>`)
      .append(`<p>vochtigheid = ${Math.round(this.weather.humidity)}% </p>`);

    $(".img").attr("src", this.zalando.media.images[0].largeHdUrl);
    $(".buy").attr("href", this.zalando.shopUrl);
  }

}


const options = {
  'apikey': '6a092a5ca16b4b1ffbdcba3b5d5e0480',
  'el': '#app',
  'zalandoRegen': 'UR622H01P-N11',
  'zalandoKoud': '2NA22S02N-C11',
  'zalandoWarm': '4BE22O02B-K11'
}

const App = new Weather(options);
