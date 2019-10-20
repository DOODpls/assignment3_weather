
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
  locres = (lat.toFixed(4)+','+long.toFixed(4));
  render()
  dateTime()
  resetDaily()
},function(error){
  if (error.code === error.PERMISSION_DENIED){
    locres = '53.5403912,-113.4960643';
  render()
  resetDaily()
  }
})
}
locationData()
function search(ele) {
  if(event.key === 'Enter') {
    var url3 = 'https://geocode.xyz/' + ele.value +'?json=1'   //this is where i convert the long,lat to city name
    fetch(url3)
    .then(z => z.json())
    .then(z => {
      if(ele.value == ''){
        locationData()
        render()
        resetDaily()
      }else{
        locres = (z.latt+','+z.longt)
      render()
      resetDaily()
      }
    })     
  }
}
function dateTime(){
  var today = new Date();
  dateTm = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+('0' + today.getDate()).slice(-2)+'T'+ ('0' + today.getHours()).slice(-2) + ":" + ('0' + today.getMinutes()).slice(-2) + ":" + ('0' + today.getSeconds()).slice(-2);
  
}
var skycons = new Skycons({"color": "white"});
function urlss(){
  dateTime()
  proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  url1 = 'https://api.darksky.net/forecast/c34e122a56ae30a3090687878bce72c3/' + locres +'?units=auto'   //i have to use proxy because of CORS
}




 function render(){
   console.log(locres)
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
    let cityy = document.querySelector('.city')
    let weeksumm = document.querySelector('.week-summary')
    let dailycont = document.querySelector('.week-day-container')
    
    var d = new Date()
    var d2 = d.getDate()+'/'+(d.getMonth()+1)
    var datetoday = d2
    
    var url2 = 'https://geocode.xyz/' + locres +'?json=1'   //this is where i convert the long,lat to city name
    fetch(url2)
    .then(y => y.json())
    .then(y => {
      cityy.textContent = y.city +', '+ y.country
      console.log(y)
    })
    urlss()
    fetch(proxyUrl + url1)
    .then(x => x.json())
    .then(x => {
      console.log(x)
      times = new Date( x.currently.time *1000).toLocaleTimeString("en-US", {timeZone: x.timezone}).replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
      htem.textContent = x.currently.temperature.toFixed(1)+'°c'
      apptemp.textContent = 'Feels like:  '+ x.currently.apparentTemperature.toFixed(1)+'°c'
      desc.textContent = x.currently.summary
      datenow.textContent = times
      windspd.textContent = 'Wind:  ' + x.currently.windSpeed+' Kph'
      windir.style.transform = 'rotate(-'+x.currently.windBearing+'deg)'
      console.log(x.currently.windBearing)
      visib.textContent = 'Visibility:  '+ x.currently.visibility+'km'
      humid.textContent = 'Humidity:  ' + x.currently.humidity * 100+'%'
      uvind.textContent = 'UV Index:  '+ x.currently.uvIndex
      press.textContent = 'Pressure:  '+ x.currently.pressure+' hPa'
      weeksumm.textContent = x.daily.summary
      preload.style.display = 'none'
      console.log(x.currently.time)
      


      skycons.set("icon0", Skycons = x.currently.icon);
      skycons.play();
      
      for(i=0;i<8;i++){

        // dately = new Date( x.hourly.data[i].time *1000)
        console.log(x.daily.data[i].time)
        console.log(x.daily.data[i].summary)
        

        const divs = document.createElement('div')
        divs.className = ('week-day-container')
        const divsholdr = document.querySelector('.week-stage')
        const canv = document.createElement('canvas')
        canv.id = ('icons'+(i+1))
        canv.height = 120
        canv.width = 100
        
        var d1 = new Date()
        var d3 = (d1.getDate()+i)+'/'+(d1.getMonth()+1)
        var datetoday = d3
        divs.appendChild(canv)
        divsholdr.appendChild(divs)
        
        const spann = document.createElement('span')
        spann.className = 'spanini'
        const linkk = document.createElement('a')
        linkk.href = 'https://youtube.com'
        linkk.appendChild(spann)
        divs.appendChild(linkk)

        const rainn = document.createElement('p')
        rainn.textContent = 'Rain: ' + x.daily.data[i].precipProbability* 100 +'%'
        divs.appendChild(rainn)

        const dates = document.createElement('p')
        dates.textContent = x.daily.data[i].time
        divs.appendChild(dates)

        const br = document.createElement('br')
        divs.appendChild(br)

        const temph = document.createElement('p')
        temph.textContent = 'High: '+ x.daily.data[i].temperatureHigh 
        divs.appendChild(temph)

        const tempL = document.createElement('p')
        tempL.textContent = 'Low: ' + x.daily.data[i].temperatureLow   
        divs.appendChild(tempL)

        const summ = document.createElement('p')
        summ.textContent = x.daily.data[i].summary
        summ.style.textAlign ='center'
        summ.style.fontWeight='bold'
        divs.appendChild(summ)
      }
      for(y=0;y<8;y++){
        skycons.set('icons'+(y+1), Skycons = x.daily.data[y].icon)
      }
      
      
     
      for(p=0; p<20;p++){
      
      
      golden = x.hourly.data[p].time
      console.log(golden)
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
      tempp.textContent = x.hourly.data[p].temperature
      hourlyDivs.appendChild(tempp)

      const hrsumm = document.createElement('p')
      hrsumm.textContent = x.hourly.data[p].summary
      hrsumm.style.textAlign = 'center'
      hourlyDivs.appendChild(hrsumm)

      const br = document.createElement('br')
      hourlyDivs.appendChild(br)

      const hrlyrain = document.createElement('p')
      hrlyrain.textContent = x.hourly.data[p].precipProbability
      hourlyDivs.appendChild(hrlyrain)

      const windspeedcont = document.createElement('div')
      windspeedcont.className = 'loopwind'
      hourlyDivs.appendChild(windspeedcont)

      const rotatearrow = document.createElement('div')
      rotatearrow.className = 'arrow-rotator'
      rotatearrow.style.transform = 'rotate(-'+x.hourly.data[p].windBearing+'deg)'
      windspeedcont.appendChild(rotatearrow)

      const windsp = document.createElement('p')
      windsp.textContent = x.hourly.data[p].windSpeed
      windspeedcont.appendChild(windsp)
      
      const hrlytime = document.createElement('p')
      hrlytime.textContent = times
      hourlyDivs.appendChild(hrlytime)
      
    }
    for(u=0;u<20;u++){
      skycons.set('icons'+(u+9), Skycons = x.hourly.data[u].icon)
    }
    })
}

