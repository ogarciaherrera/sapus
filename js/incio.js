$(function () {

    var URLactual = window.location.pathname;
    
    if (URLactual == '/html/index.html') {

        $.getScript('js/index.js');

    } else {

        $.getScript('js/home.js');

    }

})