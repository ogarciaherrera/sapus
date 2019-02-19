$(function () {

    var URLactual = window.location.pathname;

    alert('Aplicacion en linea!');
    
    if (URLactual == '/html/index.html') {

        $.getScript('js/index.js');

    } else {

        $.getScript('js/home.js');

    }

})