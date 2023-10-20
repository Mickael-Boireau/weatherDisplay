let nIntervId ;
if (!nIntervId) {
    nIntervId = setInterval(refresh, 3600000) ;
}

var confURL = 'conf.json' ;
var conf = new XMLHttpRequest() ;
conf.open("GET", confURL) ;
conf.responseType = "json" ;
conf.send() ;
conf.onload = function () {
    var confJson = conf.response ;
    
    createEl('h1', "<br>" + capital1Let(confJson["ville"]) ,'titre') ;
    
    var q = confJson["ville"] + "," + confJson["pays"] ;
    var key = confJson["apiKey"] ;
    var units = confJson["unites"] ;
    var lang = confJson["lang"] ;
    
    var requestURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + q + '&APPID=' + key + "&units=" + units + "&lang=" + lang ;
    var request = new XMLHttpRequest() ;
    request.open("GET", requestURL) ;
    request.responseType = "json" ;
    request.send() ;
    request.onload = function () {
        var weatherJson = request.response ;
        display(weatherJson) ;
        //console.debug(weatherJson);
    };
    
};

function display(weatherJson) {
    var tmax = weatherJson["main"]["temp_max"] + "°C" ;
    var tmin = weatherJson["main"]["temp_min"] + "°C" ;
    var tcurrent = weatherJson["main"]["temp"] + "°C" ;
    var tfeels = weatherJson["main"]["feels_like"] + "°C" ;
    var hum = weatherJson["main"]["humidity"] + "%" ;
    var press = weatherJson["main"]["pressure"] + " hPa" ;
    var jour = weatherJson["sys"]["sunrise"] ;
    var nuit = weatherJson["sys"]["sunset"] ;
    var ciel = weatherJson["weather"][0]["description"] ;
    var ventSpeed = weatherJson["wind"]["speed"] + " m/s" ;
    var transfVentSpeed = weatherJson["wind"]["speed"] * 3.6 * 100 ;
    transfVentSpeed = Math.round(transfVentSpeed) ;
    var ventSpeedBig = (transfVentSpeed / 100) + " km/h" ; 
    var ventDir = weatherJson["wind"]["deg"] ;
    
    createEl('p', "Lever du jour :<br><h2>" + heure(jour) + "</h2>", 'sunrise') ;
    createEl('p', "Coucher du jour :<br><h2>" + heure(nuit) + "</h2>", 'sunset') ;
    createEl('p', "Minimale :<br><b>" + tmin + "</b>", 'tmin') ;
    createEl('p', "Maximale :<br><b>" + tmax + "</b>", 'tmax') ;
    createEl('p', "<h3>" + tcurrent + "</h3><br>Ressenti : " + tfeels, 'temp') ;
    createEl('p', "Humidité :<br><b>" + hum + "</b>", 'hum') ;
    createEl('p', "Pression :<br><b>" + press + "</b>", 'press') ;
    createEl('p', "Vitesse du vent :<br><b>" + ventSpeed + "</b>" + "<br><b>" + ventSpeedBig + "</b>", 'vent') ;
    createEl('p', "<h3>" + capital1Let(ciel) + "</h3>", 'ciel') ;
    createEl('span', "Dernière mise à jour " + dateStamp() , 'majTime') ;
    oriente(ventDir) ;
}

function createEl(tag, content, place) {
    var elementAdd = document.createElement(tag) ;
    elementAdd.innerHTML = content ;
    document.getElementById(place).appendChild(elementAdd) ;
}

function heure(time) {
    var date = new Date(time*1000) ;
    var hrs = date.getHours() ;
    var min = "0" + date.getMinutes() ;
    return (hrs + "H" + min.substr(-2)) ;
}

function dateStamp() {
    var majTime = Date.now() ;
    var date = new Date(majTime) ;
    var year = date.getFullYear() ;
    var month = date.getMonth() + 1 ;
    var day = date.getDate() ;
    var hrs = date.getHours() ;
    var min = "0" + date.getMinutes() ;
    var sec = "0" + date.getSeconds() ;
    return ("le " + day + "/" + month + "/" + year + " à " + hrs + "H" + min.substr(-2) + "min" + sec.substr(-2)) ;
}

function capital1Let(string) {
    return string[0].toUpperCase() + string.slice(1) ;
}

function refresh() {
    window.location.reload() ;
}

function rotateImage(image, angle) {
    var canvas = document.getElementById('compass') ;
    var context = canvas.getContext('2d') ;
    context.clearRect(0, 0, canvas.width, canvas.height) ;
    context.translate(canvas.width / 2, canvas.height / 2) ;
    context.rotate(angle * Math.PI / 180) ;
    context.drawImage(image, -image.width / 2, -image.height / 2, image.width, image.height) ;
    context.setTransform(1, 0, 0, 1, 0, 0) ;
}

function oriente(angle) {
    var monimage = new Image() ;
    monimage.src = 'aiguille.png' ;
    monimage.onload = function () {
        rotateImage(monimage, angle) ;
    };
}