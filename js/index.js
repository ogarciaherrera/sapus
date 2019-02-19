var db;
var base = "acceso";
var ver = "1.0";
var desc = "Usuario de acceso";
var size = 2 * 1024 * 1024;


$(function () {

    if (!window.openDatabase) {
        alert('Este navegador NO soporta el API WebSQL');
        return;
    }

    db = openDatabase(base, ver, desc, size);

    q = 'CREATE TABLE IF NOT EXISTS usuariosesion(parametro TEXT)';

    db.transaction(function (tx) { tx.executeSql(q); }, funerror, funexito);

    $('#enviar').click(function(){ funAcceso(""); })

    $('#acepto').click(function () { $.unblockUI(); })

	var qry = 'SELECT * FROM usuariosesion LIMIT 1';
	
	db.transaction(function (tx) {

	    tx.executeSql(qry, [], function (tx, data) {
	    
	        var len = data.rows.length;

	        if(len!=0){

	            var parametro = data.rows.item(0).parametro;

	            funAcceso(parametro);
            
	        }

	    });

	}, funerror, funexito);

})

function funerror(e){ console.log('Error: '+e.message); }

function funexito(){ console.log('Correcto') }

function blockScreen(smessage,iblock,itime) {

  if (iblock==1){ 

    $.blockUI({ 

      message: smessage, 
      css: { 

        left: ($(window).width() - 280) /2 + 'px', 
        width: '280px',
        'border-radius': '10px'

      } 

    }); 

  } 

}


function funAcceso(parametro) {

    if (parametro == "") {

        if ($('#usuario').val() == "" && $('#clave').val() == "") { return; }

        var sistemaid = $.base64.encode($('#sistemaid').val());
        var usuario = $.base64.encode($('#usuario').val());
        var clave = $.base64.encode($('#clave').val());

        parametro = sistemaid + '_XX_' + usuario + '_XX_' + clave;

    }

    var parametros = 'id=1&parametro=' + parametro;

    wsurl = 'http://facturacionchata.com/blockpage/BlockUsInicial.aspx?' + parametros;

    alert(wsurl);

	$.ajax({
		
		type: 'POST',
		url: wsurl,
		cache: false,
		dataType: 'xml',
		beforeSend: function(){ $('#validando').html("Validando usuario..."); },
		success: function(response) {

		    var jqxml = $(response);
		    var resultado = jqxml.find('string').text();

			$('#validando').html("");

			if (resultado == "correcto") {

			    var sqdel = 'DELETE FROM usuariosesion';
	
			    db.transaction(function(tx){ tx.executeSql(sqdel,[],function(tx,data){

			        var sqins = 'INSERT INTO usuariosesion (parametro) VALUES (?)';

			        db.transaction(function(tx){ tx.executeSql(sqins,[parametro],function(tx,data){

			            window.open("home.html","_self");
			    
			        }); }, funerror, funexito);

			    
			    }); }, funerror, funexito);

			}else{

			    $('#avisotit1').html("Error 1: "+resultado);

				blockScreen($("#avisos1"),1,0);

			}

		},
		error: function(jqXHR,text_status,strError) {

			$('#validando').html(""); 

			$('#avisotit1').html("Error 0: " + text_status + " " + strError + " " + jqXHR.responseText);

            blockScreen($("#avisos1"),1,0);

        }

	})


}

