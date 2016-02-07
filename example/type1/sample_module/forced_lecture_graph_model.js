import $ from 'jquery'


export default class forced_lecture_graph_model {

	constructor(){
	}

	get( url ){

	  return new Promise( function( resolve, reject ) {

	    $.get(url, function( data ){
	      resolve( data );
	    }).fail( function(){
	      reject( new Error("Error") );
	    });

	  });
	  
	}

	post( url, data ){
		return new Promise( function( resolve, reject ){
			$.ajax({
		        contentType: 'application/json',
		        data: data,
		        dataType: 'json',
		        success: function(data){
		    		resolve( data );
				},
		        error: function(){
		        	reject( new Error("Error") );
		        },
		        processData: false,
		        type: 'POST',
		        url: url
		    });

		});
	}

	getFullData(){
		return this.get( 'api/front-graph' );
	}

	addNode( name, url ){
		var data = "{" + 
            			"\"name\": \"" + name + "\"," +
            			"\"url\": \"" + url + "\"" +
        			"}";
        return this.post( '/api/front-graph-add-node', data );
	}

	removeNode( name ){
		var data = "{" + 
            			"\"name\": \"" + name + "\"" +
        			"}";
        return this.post( '/api/front-graph-remove-node', data );
	}

	addLink( source, target ){
		var data = "{" + 
            "\"source\": \"" + source + "\"," +
            "\"target\": \"" + target + "\"" +
        "}";
        return this.post( '/api/front-graph-add-link', data );
	}

	removeLink( source, target ){
		var data = "{" + 
            "\"source\": \"" + source + "\"," +
            "\"target\": \"" + target + "\"" +
        "}";
        return this.post( '/api/front-graph-remove-link', data );
	}

}