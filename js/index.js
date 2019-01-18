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

    q = 'CREATE TABLE IF NOT EXISTS usuariosap(sistema TEXT, usuario TEXT, clave TEXT)';

    db.transaction(function (tx) { tx.executeSql(q); }, funerror, funexito);

    $('#enviar').click(function(){ funAcceso(); })

	$('#acepto').click(function(){ $.unblockUI(); })

	var qry = 'SELECT * FROM usuariosap LIMIT 1';
	
	db.transaction(function(tx){ tx.executeSql(qry,[],function(tx,data){
	    
	    var len = data.rows.length;

	    if(len!=0){

	        $('#sistemaid').val(data.rows.item(0).sistema);
	        $('#usuario').val(data.rows.item(0).usuario);
	        $('#clave').val(data.rows.item(0).clave);

	        funAcceso();
            
	    }

    	}); }, funerror, funexito); 

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

function funAcceso(){

	var sistemaid = $('#sistemaid').val();
	var usuario = $('#usuario').val();
	var clave = $('#clave').val();

	$.get("home.xml", function (xml) { 

	    $(xml).find("IniciarSesion").each(function () {

	        wsurl = $(this).attr('DirecionURL');

	        $.ajax({
		
		        type: 'POST',
		        url: wsurl,
		        data: { sistema: sistemaid, usuario: usuario, clave: clave },
		        dataType: 'xml',
		        beforeSend: function(){ $('#validando').html("Validando usuario..."); },
		        success: function(response) {

		            var jqxml = $(response);
		            var resultado = jqxml.find('string').text();

			        $('#validando').html("");

			        if (resultado == "correcto") {

			            var sqdel = 'DELETE FROM usuariosap';
	
			            db.transaction(function(tx){ tx.executeSql(sqdel,[],function(tx,data){

			                var sqins = 'INSERT INTO usuariosap (sistema, usuario, clave) VALUES (?, ?, ?)';

			                db.transaction(function(tx){ tx.executeSql(sqins,[sistemaid, usuario, clave ],function(tx,data){

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

			        $('#avisotit1').html("Error 0: "+text_status+" "+strError);

                    blockScreen($("#avisos1"),1,0);

                }

	        })

	    })

	})


}

