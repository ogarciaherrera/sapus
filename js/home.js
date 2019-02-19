var db;
var base = "acceso";
var ver = "1.0";
var desc = "Usuario de acceso";
var size = 2 * 1024 * 1024;

$(function () {

    document.addEventListener("backbutton", onBackKeyDown, false);
            
    db = openDatabase(base, ver, desc, size);

    var qry = 'SELECT * FROM usuariosesion LIMIT 1';

    db.transaction(function (tx) {

        tx.executeSql(qry, [], function (tx, data) {

            var len = data.rows.length;

            if (len == 0) {

                window.open("index.html", "_self");

            }

        });

    }, funerror, funexito);

    $('#desbloquear').click(function () { selectusuario('2'); })

    $('#bloquear').click(function () { selectusuario('3'); })

    $('#cerrarsesion').click(function () { cerrarseion(); })

    $('#aceptado').click(function () { $.unblockUI(); })

})

function onConfirm(button) {

    if (button == "Si") { navigator.app.exitApp(); }

}

function showConfirm() {

    navigator.notification.confirm(
        'Salir de la App',  // message
        onConfirm,          // callback to invoke with index of button pressed
        'Salir',            // title
        'Si,No'             // buttonLabels

    );

}

function onBackKeyDown() { showConfirm(); }

function funerror(e) { console.log('Error: ' + e.message); }

function funexito() { console.log('Correcto') }

function selectusuario(id) {

    var qry = 'SELECT * FROM usuariosesion LIMIT 1';

    db.transaction(function (tx) {

        tx.executeSql(qry, [], function (tx, data) {

            if (data.rows.length != 0) {

                var datosusuario = data.rows.item(0).parametro;

                desbloquear(datosusuario,id);

            }

        });
    }, funerror, funexito);

}

function desbloquear(datosusuario,id) {

    if ($('#usnombre').val() == "") { return; }

    var usnombre = $.base64.encode($('#usnombre').val());

    parametro = datosusuario + '_XX_' + usnombre;

    var parametros = 'id=' + id + '&parametro=' + parametro;

    wsurl = 'http://facturacionchata.com/blockpage/BlockUsInicial.aspx?' + parametros;

    $.ajax({

        url: wsurl,
        type: 'POST',
        crossDomain: true,
        cache: false,
        dataType: 'xml',
        beforeSend: function () { $('#validando').html("Desbloqueando usuario..."); },
        success: function (response) {

            var jqxml = $(response);
            var resultado = jqxml.find('string').text();

            $('#avisotit3').html(resultado);

            blockScreen($("#avisos3"), 1, 0);

        },
        error: function (jqXHR, text_status, strError) {

            $('#validando').html("");

            $('#avisotit1').html("Error 0: " + text_status + " " + strError);

            blockScreen($("#avisos1"), 1, 0);

        }

    })


}

function blockScreen(smessage, iblock, itime) {

    if (iblock == 1) {

        $.blockUI({

            message: smessage,
            css: {

                left: ($(window).width() - 280) / 2 + 'px',
                width: '280px',
                'border-radius': '10px'

            }

        });

    }

}

function cerrarseion() {

    var sqdel = 'DELETE FROM usuariosesion';
	
    db.transaction(function (tx) {

        tx.executeSql(sqdel, [], function (tx, data) {

            window.open("index.html", "_self");

        })

    }, funerror, funexito);

}