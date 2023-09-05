jQuery( function() {
	var citiesJson;
	var citiesCount;

	/**
	 * Verifica se é uma cidade válida.
	 */
	function isValidCity( msg ) {
		if( jQuery.inArray( msg, citiesJson ) != -1 ) {
			return true;
		};

		return false;
	}

	/**
	 * Ordena as cidades por quantidade de pessoas.
	 */
	function orderingByNumber( data ) {
		let objCities = new Array();
		let index = 0;
		for ( let i in data ) {
			objCities[ index ] = {
				city: i,
				qntd: data[i]
			};
			index ++;
		}

		return objCities.sort( (a, b) => {
			return b.qntd - a.qntd;
		} );
	}

	/**
	 * Contabiliza a quantidade de cidades, usando o nome ou o celular como índice.
	 */
	function calculate() {
		const messages = jQuery( this ).val();
		const indexRegExp = /[0-9]+\] ([0-9+\- a-zA-ZÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏàáâãäåæçèéêëìíîïÐÑÒÓÔÕÖØÙÚÛÜÝÞßðñòóôõöøùúûüýþÿ]+): /;
		const msgRegExp = /\: (.+)/;
		const lines = messages.split( "\n" );
		let index;
		let msg;
		let usersCount = new Array();
		citiesCount = new Array();

		for( let i in lines ) {
			index = lines[i].match( indexRegExp );
			msg = lines[i].match( msgRegExp );
			if ( index != null ) {
				index = index[1].replace(/[ \-\+\:]/g, '');
				msg = msg[1].replace( /\/.+/g, '' );

				if ( isValidCity( msg ) ) {
					if ( jQuery.inArray( index, usersCount ) == -1 ) {
						citiesCount[msg] = citiesCount[msg] == undefined ? 1 : citiesCount[msg] + 1;
					}

					usersCount.push( index );
				}
			}
		}

		generateReport( orderingByNumber( citiesCount ) );
	}

	/**
	 * Gera a tabela com a contagem das cidades.
	 */
	function generateReport( data ) {
		let html = '';
		html += ''+
			'<thead>'+
				'<tr>'+
					'<th>Cidade</th>'+
					'<th>Quantidade</th>'+
				'</tr>';
			'</thead>';

		html += '<tbody>';
		for( let i in data ) {
			html += ''+
				'<tr>'+
					'<td>'+
						data[i].city+
					'</td>'+
					'<td>'+
						data[i].qntd+
					'</td>'+
				'</tr>';
		}
		html += '</tbody>';

		jQuery( '#results' ).html( html );
	}

	/**
	 * Carrega a lista de cidades do PR.
	 */
	function loadCitiesJson() {
		$.ajax( {
			dataType: "json",
			url: 'pr.json',
			success: function (e) {
				jQuery( '#messages' ).removeAttr( 'disabled' );
				citiesJson = e;
			}
		  } );
	}

	( function(){
		loadCitiesJson();
		jQuery( '#messages' ).on( 'change', calculate );
	} )();
} );
