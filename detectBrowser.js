var btn = document.getElementById('btn');

btn.onclick = function() {
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
    var isMozilla = /Firefox/.test(navigator.userAgent) && navigator.vendor == "";
    
    if (isChrome) document.write("You are using Chrome!");
    if (isSafari) document.write("You are using Safari!");
    if (isMozilla) document.write("You are using FireFox!");

};