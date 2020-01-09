
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

var locres = Promise.resolve
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
        
        console.log(z.results)
      render()
      resetDaily()
      locationname()
      }
    })
    .catch(err3 =>{
      alert(err3)
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
  proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  url1 = 'https://api.darksky.net/forecast/c34e122a56ae30a3090687878bce72c3/' + locres +'?'+unitt   //i have to use proxy because of CORS
}



function locationname(){
  let cityy = document.querySelector('.city')
  var url2 = 'https://geocode.xyz/' + locres +'?json=1'   //this is where i convert the long,lat to city name
  fetch(url2)
  .then(y => y.json())
  .then(y => {
    cityy.textContent = y.city +', '+ y.country
    
  })
  .catch (err2 => {
    alert('Failed to retrieve location data.')
  })
}

//---------------------------------CURRENT------------------------------------------------//

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
  fetch(proxyUrl + url1)
  .then(x => x.json())
  .then(x => {

  
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
  
  
//==========================================WEEKLY=================================================// 

  
  weeksumm.textContent = x.daily.summary
  preload.style.display = 'none'
  

  skycons.set("icon0", Skycons = x.currently.icon);
  skycons.play();////this is where the icon animation comes from, API default
  
  for(i=0;i<8;i++){ /////loop based on the data given by the json, starts with 0 ends with 7
    
    dately = new Date( x.daily.data[i].time *1000)
    
    var datel = dately.getDate()+'/'+(dately.getMonth()+1)
    var datetoday = datel

    
    
    const spann = document.createElement('span')
    spann.className = 'spanini'
    spann.id = 'spanini'
    const divs = document.createElement('div') ////////////i was planning to make the weekly divs clickable so i can change the hourly based on the day that i clicked, but im too dumb so ididnt do it.
    divs.className = ('week-day-container')
    const divsholdr = document.querySelector('.week-stage')
    const canv = document.createElement('canvas')
    canv.id = ('icons'+(i+1))  
    canv.height = 120
    canv.width = 100
    
    
    divs.appendChild(canv)
    divsholdr.appendChild(spann)
    spann.appendChild(divs)

    const rainn = document.createElement('p')
    rainn.textContent = 'Rain: ' + x.daily.data[i].precipProbability.toFixed(1)* 100 +'%'
    divs.appendChild(rainn)

    const dates = document.createElement('p')
    dates.className = 'date-now'
    dates.textContent = datetoday
    divs.appendChild(dates)

    const br = document.createElement('br')
    divs.appendChild(br)

    const temph = document.createElement('p')
    temph.textContent = 'High: '+ x.daily.data[i].temperatureHigh + temppp
    divs.appendChild(temph)

    const tempL = document.createElement('p')
    tempL.textContent = 'Low: ' + x.daily.data[i].temperatureLow + temppp 
    divs.appendChild(tempL)

    const summ = document.createElement('p')
    summ.textContent = x.daily.data[i].summary
    summ.style.textAlign ='center'
    summ.style.fontWeight='bold'
    divs.appendChild(summ)
  }
  for(y=0;y<8;y++){
    skycons.set('icons'+(y+1), Skycons = x.daily.data[y].icon) //////seperate loop for icons
  }



//--------------------------------------------HOURLY-------------------------------------------------//     
    
  for(p=0; p<20;p++){/////////////the limit is 20, i tried to put 40 but it wont load
    
    golden = x.hourly.data[p].time
    
    /////////////////////this is where i convert unix time to AP/PM
    times = new Date( golden *1000).toLocaleTimeString("en-US", {timeZone: x.timezone}).replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    const hourlyDivs = document.createElement('div')
    hourlyDivs.className = ('hourly-cards')
    const hourlyHolder = document.querySelector('.hourly-row')
    hourlyHolder.appendChild(hourlyDivs)

    const canv2 = document.createElement('canvas')
    canv2.id = ('icons'+(p+9))
    canv2.height = 120
    canv2.width = 100
    hourlyDivs.appendChild(canv2)

    const tempp = document.createElement('P')
    tempp.textContent = x.hourly.data[p].temperature + temppp
    hourlyDivs.appendChild(tempp)

    const hrsumm = document.createElement('p')
    hrsumm.textContent = x.hourly.data[p].summary
    hrsumm.style.textAlign = 'center'
    hourlyDivs.appendChild(hrsumm)

    const br = document.createElement('br')
    hourlyDivs.appendChild(br)

    const hrlyrain = document.createElement('p')
    hrlyrain.textContent ='Rain: ' + x.hourly.data[p].precipProbability.toFixed(1) * 100+'%'
    hourlyDivs.appendChild(hrlyrain)

    const windspeedcont = document.createElement('div')
    windspeedcont.className = 'loopwind'
    hourlyDivs.appendChild(windspeedcont)

    const rotatearrow = document.createElement('div')
    rotatearrow.className = 'arrow-rotator'
    rotatearrow.style.transform = 'rotate(-'+x.hourly.data[p].windBearing+'deg)'
    windspeedcont.appendChild(rotatearrow)

    const windsp = document.createElement('p')
    windsp.textContent = x.hourly.data[p].windSpeed+windspd1
    windspeedcont.appendChild(windsp)
    
    const hrlytime = document.createElement('p')
    hrlytime.textContent = times
    hourlyDivs.appendChild(hrlytime)
  }

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
  .catch( err => {
    alert('Failed to retireve data')
  })
  
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


// __________________________      Auto Complete     _________________________________________________

jQuery(function () {
  jQuery("#f_elem_city").autocomplete({
  source: function (request, response) {
    jQuery.getJSON(
      'https://api.opencagedata.com/geocode/v1/json?key=3eb2cc6ab0ac4ef986e4c30c2da5e38c&q=' + request.term + '&pretty=1&no_annotations=1',
    function (data) {
      response(data.results[1]);
      console.log(data.results[1].formatted)
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
// window.addEventListener('load', function () {
//   var datee = document.getElementsByClassName('date-now')
//   console.log(datee)
//   console.log(datee.length)
//   console.log(datee[0])               getting value of html tag via htmlcollection.. but it doenst work
// });
