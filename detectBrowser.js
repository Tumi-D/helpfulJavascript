var btn = document.getElementById('btn');

btn.onclick = function() {
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    var isSafari = /Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor);
    var isMozilla = /Firefox/.test(navigator.userAgent) && navigator.vendor == "";
    var isOpera = navigator.userAgent.indexOf(' OPR/') >= 0) && /Google Inc/.test(navigator.vendor);
    if (isChrome) document.write("You are using Chrome!");
    if (isSafari) document.write("You are using Safari!");
    if (isMozilla) document.write("You are using FireFox!");
    if (isOpera) document.write("You are using Opera!");
};

// function getBrowser() {

//     // Opera 8.0+
//        if ((!!window["opr"] && !!["opr"]["addons"]) || !!window["opera"] || navigator.userAgent.indexOf(' OPR/') >= 0) {
//            return 'opera';
//        }
   
//        // Firefox 1.0+
//        if (typeof window["InstallTrigger"] !== 'undefined') {
//            return 'firefox';
//        }
   
//        // Safari 3.0+ "[object HTMLElementConstructor]" 
//        if (/constructor/i.test(window["HTMLElement"]) || (function(p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof window["safari"] !== 'undefined' && window["safari"].pushNotification))) {
//            return 'safari';
//        }
   
//        // Internet Explorer 6-11
//        if (/*@cc_on!@*/false || !!document["documentMode"]) {
//            return 'ie';
//        }
   
//        // Edge 20+
//        if (!(/*@cc_on!@*/false || !!document["documentMode"]) && !!window["StyleMedia"]) {
//            return 'edge';
//        }
   
//        // Chrome 1+
//        if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
//            return 'chrome';
//        }
   
//        // Blink engine detection
//        if (((!!window["chrome"] && !!window["chrome"].webstore) || ((!!window["opr"] && !!["opr"]["addons"]) || !!window["opera"] || navigator.userAgent.indexOf(' OPR/') >= 0)) && !!window["CSS"]) {
//            return 'blink';
//        }
//    }
   
//    let browser = getBrowser();
   
//    document.write("You are using "+ browser)