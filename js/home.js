var db;
var base = "acceso";
var ver = "1.0";
var desc = "Usuario de acceso";
var size = 2 * 1024 * 1024;

$(function () {

    db = openDatabase(base, ver, desc, size);

    $('#desbloquear').click(function () { selectusuario(); })

    $('#cerrarsesion').click(function () { cerrarseion(); })

    $('#aceptado').click(function () { $.unblockUI(); })

})

function funerror(e) { console.log('Error: ' + e.message); }

function funexito() { console.log('Correcto') }

function selectusuario() {

    var qry = 'SELECT * FROM usuariosap LIMIT 1';

    db.transaction(function (tx) {

        tx.executeSql(qry, [], function (tx, data) {

            var len = data.rows.length;

            if (len != 0) {

                var sistema = data.rows.item(0).sistema;
                var usuario = data.rows.item(0).usuario;
                var clave = data.rows.item(0).clave;

                desbloquear(sistema, usuario, clave);

            }

        });
    }, funerror, funexito);

}

function desbloquear(sistemaid, usuario, clave) {

    var usnombre = $('#usnombre').val();

    $.get("home.xml", function (xml) { 

        $(xml).find("Desbloqueo").each(function () {

            wsurl = $(this).attr('DirecionURL');

            $.ajax({

                type: 'POST',
                url: wsurl,
                data: { sistema: sistemaid, usuario: usuario, clave: clave, usnombre: usnombre },
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

        })

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

    var sqdel = 'DELETE FROM usuariosap';
	
    db.transaction(function (tx) {

        tx.executeSql(sqdel, [], function (tx, data) {

            window.open("index.html", "_self");

        })

    }, funerror, funexito);

}