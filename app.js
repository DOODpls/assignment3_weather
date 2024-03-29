
let preload = document.querySelector('.preload')
window.addEventListener('load', function(){
  preload.style.display = 'block'
})

function resetDaily(){
  let delt = document.querySelector('.week-stage') //whenever i get data from api and the weekly needs to be resetted so the loop will generate data again
      delt.innerHTML = ''
  
  let delthr = document.querySelector('.hourly-row')
      delthr.innerHTML =''
}

var locres;
function locationData(){
navigator.geolocation.getCurrentPosition(function showLocation(position) {
  lat = position.coords.latitude;
  long = position.coords.longitude;
  locres = (lat.toFixed(4)+','+long.toFixed(4)); //////this is where i get the long and lat, locally on machine and limit it to 4 decimals
  locationname()
  render()
  resetDaily()
},function(error){
  if (error.code === error.PERMISSION_DENIED){
    locres = '53.5403912,-113.4960643'; /////if the user refuses to accept location, itll give default data... in Edmonton
    locationname()
    render()
    resetDaily()
  }
})
}


locationData()
function search(ele) {
  if(event.key === 'Enter') {
    var url3 = 'https://api.opencagedata.com/geocode/v1/json?key=3eb2cc6ab0ac4ef986e4c30c2da5e38c&q=' + ele.value + '&pretty=1&no_annotations=1'   //this is where i convert the long,lat to city name, this api has a limit, so please dont abuse it huhuhuhuu
    fetch(url3)
    .then(z => z.json())
    .then(z => {
      if(ele.value == ''){
        alert('No city entered, returning to default city..')
        resetDaily()
        locationData()
      }else{
        locres = (z.results[0].geometry.lat+','+z.results[0].geometry.lng)
        render()
        resetDaily()
        locationname()
        $('.alerts').remove();
        $('.alertinfo').remove();
      }
    })
    .catch(err3 =>{
      alert("No place entered, Returning to default location")
    })   
  }
}


var cel = document.querySelector('.celsius')
var far = document.querySelector('.farenheight')
var unitt = 'units=ca' ////API has configuration of measurements
var windspd1 = "km/H"
var visibb = 'km'
var temppp = '°C'

document.getElementById("cell").onclick = function() { ///// this is where i convert everthing metric and imperial measurements
  unitt = 'units=ca'
    render()
    resetDaily()
    windspd1 = "km/H"
    visibb = 'km'
    temppp = '°C '
  };


far.addEventListener('click', function(){
  unitt = 'units=us'
  render()
  resetDaily()
  windspd1 = "mp/H"
  visibb = 'mi'
  temppp = '°F '
})

var skycons = new Skycons({"color": "white"});
function urlss(){ /////this is where most of the data come from
  proxyUrl = 'https://crossorigin.me/';
  url1 = 'https://api.darksky.net/forecast/c34e122a56ae30a3090687878bce72c3/' + locres +'?'+unitt   //i have to use proxy because of CORS
}



function locationname(){
  let cityy = document.querySelector('.city')
  var searchval = document.querySelector('#f_elem_city')
  if (searchval.value.length == 0){
    var url2 = 'https://api.opencagedata.com/geocode/v1/json?key=3eb2cc6ab0ac4ef986e4c30c2da5e38c&q=' + locres + '&pretty=1&no_annotations=1'   //this is where i convert the long,lat to city name
  } else if(searchval.value.length >0){
    var url2 = 'https://api.opencagedata.com/geocode/v1/json?key=3eb2cc6ab0ac4ef986e4c30c2da5e38c&q=' + searchval.value + '&pretty=1&no_annotations=1' 
  }
  
  fetch(url2)
  .then(y => y.json())
  .then(y => {
    cityy.textContent = y.results[0].formatted;  
  })
  .catch (err2 => {
    alert('Failed to retrieve location data.')
  })
}


//---------------------------------CURRENT------------------------------------------------//




// new Vue({
//   el: '#today-container',
//   data: {
//   },
//   methods: {
//     opendescription
//   }
// })

var title, description, from, to;
function render(){
  
  let htem = document.querySelector('.today-temp')
  let desc = document.querySelector('.today-description')
  let apptemp = document.querySelector('.app-temp')
  let datenow = document.querySelector('.today-minmax')
  let windir = document.querySelector('.wind-direction')
  let windspd = document.querySelector('.wind-speed')
  let visib = document.querySelector('.visibility')
  let humid = document.querySelector('.humidity')
  let uvind = document.querySelector('.uvindex')
  let press = document.querySelector('.pressure')
  
  let weeksumm = document.querySelector('.week-summary')
  let dailycont = document.querySelector('.week-day-container')
  
  // var d = new Date()
  // var d2 = d.getDate()+'/'+(d.getMonth()+1)
  // var datetoday = d2
  
  
  urlss()
  try{
    fetch(proxyUrl+url1)
    .then(response => response.json())
    .then(function(x){
      times = new Date( x.currently.time *1000).toLocaleTimeString("en-US", {timeZone: x.timezone}).replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
      htem.textContent = x.currently.temperature.toFixed(1)+temppp
      apptemp.textContent = 'Feels like:  '+ x.currently.apparentTemperature.toFixed(1)+temppp
      desc.textContent = x.currently.summary
      datenow.textContent = times
      windspd.textContent = 'Wind:  ' + x.currently.windSpeed + windspd1
      windir.style.transform = 'rotate(-'+x.currently.windBearing+'deg)'
      
      visib.textContent = 'Visibility:  '+ x.currently.visibility.toFixed(2) + visibb
      humid.textContent = 'Humidity:  ' + x.currently.humidity.toFixed(1) * 100+'%'
      uvind.textContent = 'UV Index:  '+ x.currently.uvIndex
      press.textContent = 'Pressure:  '+ x.currently.pressure+' hPa'
      
      try{
        title = x.alerts[0].title
        description = x.alerts[0].description;
        from = new Date( x.alerts[0].time *1000).toLocaleString("en-US", {timeZone: x.timezone}).replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
        to = new Date( x.alerts[0].expires *1000).toLocaleString("en-US", {timeZone: x.timezone}).replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
      
        if(x.alerts != undefined){
          $('#today-container').append('<div class="alerts" id="alerts"></div>');
          if(x.alerts[0].severity == "warning"){
            $('#alerts').css({backgroundColor: 'red'})
          }else if(x.alerts[0].severity == "watch"){
            $('#alerts').css({backgroundColor: 'orange'})
          }else if(x.alerts[0].severity == "advosory"){
            $('#alerts').css({backgroundColor: 'green'})
          }
          document.querySelector('#alerts').innerHTML = '<p>' + x.alerts[0].title + '</p>'
          $('#today-container').append('<div class="alertinfo" id="alertinfo"></div>');
          $("#alerts").click(
            function() {
              $('#alertinfo').html('<p class="from-to">' + from + " TO " + to + '</p><p class="alert-description">' + description + '</p> <a class="alert-link" href="'+ x.alerts[0].uri +'">Weather.gc.ca</a>');
                $('#alertinfo').toggle();
            });
        }else{
          $('.alerts').remove();
          $('.alertinfo').remove();
        }
      }catch(err){
        console.log("No alerts in this location")
      }
      
    
  //  ==========================================WEEKLY=================================================// 
    
      
      weeksumm.textContent = x.daily.summary
      preload.style.display = 'none'
      
    
      skycons.set("icon0", Skycons = x.currently.icon);
      skycons.play();////this is where the icon animation comes from, API default
      
      for(i=0;i<8;i++){ /////loop based on the data given by the json, starts with 0 ends with 7
        
        dately = new Date( x.daily.data[i].time *1000)
        
        var datel = dately.getDate()+'/'+(dately.getMonth()+1)
        var datetoday = datel
      
        
        
        const spann = document.createElement('div')
        spann.className = 'spanini'
        spann.id = 'spanini' + i
        const divs = document.createElement('div') ////////////i was planning to make the weekly divs clickable so i can change the hourly based on the day that i clicked, but im too dumb so ididnt do it.
        divs.className = ('week-day-container')
        const divsholdr = document.querySelector('.week-stage')
        
        $(divs).append('<canvas id="icons'+(i+1) +'" height="120" width="100"></canvas>')
        
        divsholdr.appendChild(spann)
        spann.appendChild(divs)
        
        $(divs).append('<p class="dailyRain">Rain: ' + x.daily.data[i].precipProbability.toFixed(1)* 100 +'%' + '</p>')
        $(divs).append('<p class="date-now">' + datetoday + '</p>')
        $(divs).append('<p>High: ' + x.daily.data[i].temperatureHigh + temppp + '</p>')
        $(divs).append('<p>Low: ' + x.daily.data[i].temperatureLow + temppp + '</p>')
        $(divs).append('<p class="dailySumm" id="dailySumm">' + x.daily.data[i].summary + '</p>')
        
        $('#spanini' + i).click( function(){
          
          console.log(dately)
        })
      }
      var y;
      for(y=0;y<8;y++){
        skycons.set('icons'+(y+1), Skycons = x.daily.data[y].icon) //////seperate loop for icons
      }
    
      
    
  //  --------------------------------------------HOURLY-------------------------------------------------//     
      var hrlytm;
      for(p=0; p<20;p++){/////////////the limit is 20, i tried to put 40 but it wont load
        
        golden = x.hourly.data[p].time
        
        /////////////////////this is where i convert unix time to AP/PM
        hrlytm = new Date( golden *1000).toLocaleTimeString("en-US", {timeZone: x.timezone}).replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
        const hourlyDivs = document.createElement('div')
        hourlyDivs.className = ('hourly-cards')
        const hourlyHolder = document.querySelector('.hourly-row')
        hourlyHolder.appendChild(hourlyDivs)
      
        
        $(hourlyDivs).append('<canvas id="icons'+ (p+9) +'" height="120" width="100"></canvas>')
      
        $(hourlyDivs).append('<p>'+ hrlytm +'</p>');
        $(hourlyDivs).append('<p>'+ x.hourly.data[p].temperature + temppp +'</p>');
        $(hourlyDivs).append('<p>'+ x.hourly.data[p].summary +'</p>');
        $(hourlyDivs).append('<br/>');
        $(hourlyDivs).append('<p>Rain:'+ x.hourly.data[p].precipProbability.toFixed(1) * 100+'%</p>');
        $(hourlyDivs).append('<div class="loopwind"><div class="arrow-rotator" style="transform: rotate(-'+ x.hourly.data[p].windBearing +'deg);"></div><p>'+ x.hourly.data[p].windSpeed+windspd1 +'</p></div>');
        
        
      }
      // timeArr = Array();
      // timeForr = Array();
      // temps = Array();
      // color = Array();
      // timeLength = x.hourly.data.length
      // for(i=0; i < timeLength;i++){
      //   timeArr[i] = x.hourly.data[i].time
      //   timeForr[i] = new Date( timeArr[i] *1000).toLocaleTimeString("en-US", {timeZone: x.timezone}).replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
      //   temps[i] = x.hourly.data[i].temperature
      //   color = 'rgba(255, 255, 255, 0.2)'
      // }
      // var ctx = document.getElementById('myChart').getContext('2d');
      // var myChart = new Chart(ctx, {
      //     type: 'line',
      //     data: {
      //         labels: timeForr,
      //         datasets: [{
      //             label: 'Temperature',
      //             data: temps,
      //             backgroundColor: color,
      //             borderColor: color,
      //             borderWidth: 1
      //         }]
      //     },
      //     options: {
      //         scales: {
      //             yAxes: [{
      //                 ticks: {
      //                     beginAtZero: true
      //                 }
      //             }]
      //         }
      //     }
      // });
    
      for(u=0;u<20;u++){
        skycons.set('icons'+(u+9), Skycons = x.hourly.data[u].icon) ////// i have to seperate the loop for the icons..
      }
      
      
      
      //////////////////-------------------daily detail--------------------///////////////////////
      /////convertin time again to AM/PM
      sunriseee = new Date( x.daily.data[0].sunriseTime *1000).toLocaleTimeString("en-US", {timeZone: x.timezone}).replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
      sunseteee = new Date( x.daily.data[0].sunsetTime *1000).toLocaleTimeString("en-US", {timeZone: x.timezone}).replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
      getelement()
      daysumm.textContent = "Summary: " + x.daily.data[0].summary
      cloudcov.textContent = "Cloud Cover: " + x.daily.data[0].cloudCover.toFixed(1) *100+'%'
      sunris.textContent = "Sunrise: " + sunriseee
      sunset.textContent = "Sunset: " + sunseteee
      humidt.textContent = "Humidity: " + x.daily.data[0].humidity.toFixed(1) * 100+'%'
      dewpt.textContent = "Dew Point: " + x.daily.data[0].dewPoint+temppp
      avewinds.textContent = "Wind Speed: " + x.daily.data[0].windSpeed+windspd1
      avewindg.textContent = "Wind Gust: " + x.daily.data[0].windGust+windspd1
      habaneror.textContent = "UV Index: " + x.daily.data[0].uvIndex
    })
  }catch(err){
    alert("Cannot Retrieve Weather Info")
  }
  
  
  
}

function getelement(){
  daysumm = document.querySelector('.day-summ')
  cloudcov = document.querySelector('.cloud-cover')
  sunris = document.querySelector('.sunrise')
  sunset = document.querySelector('.sunset')
  humidt = document.querySelector('.humidity2')
  dewpt = document.querySelector('.dew-point')
  avewinds = document.querySelector('.ave-windspeed')
  avewindg = document.querySelector('.ave-windgust')
  habaneror = document.querySelector('.habanero') //uvindex(whatever) wont work idk why
}

//---------------------------------  Alerts  -----------------------------------------------------------//



// __________________________      Auto Complete     _________________________________________________

jQuery(function () {
  jQuery("#f_elem_city").autocomplete({
  source: function (request, response) {
    jQuery.getJSON(
      'https://api.opencagedata.com/geocode/v1/json?key=3eb2cc6ab0ac4ef986e4c30c2da5e38c&q=' + request.term + '&pretty=1&no_annotations=1',
    function (data) {
      arrr = Array();
      var reslength = data.results.length;
      for (i = 0; i < reslength; i++){
        arrr[i] = data.results[i].formatted
      }
      response(arrr);
    }
    );
  },
  minLength: 3
  });
});



$( "#searchbutton" ).click(function() {
  $('.city-text').addClass('city-text-appear');
});

$(window).resize(function(){     
  if ($('body').width() > 500 ){
    $('.city-text').removeClass('city-text-appear');
  }
});
   
