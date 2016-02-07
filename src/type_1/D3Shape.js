/**
 * 
 */
export class D3Shape {

	/**
	 * D3Shape
	 * @param  {[type]} name [description]
	 * @param  {[type]} conf [description]
	 * @return {[type]}      [description]
	 *
	 * conf attribute
	 * 	appendtype -> string
	 * 	appending -> function
	 * 	ticking -> function
	 * 	
	 */
	constructor( name, conf ){
		this.name = name;
		this.conf = conf;
	}

	//////////////////////////////////
	// default events
	append( method_names, parent, prop, main ){
		let conf = this.conf;

		var obj = parent.append( conf.appendtype )
                      .attr("class", this.name );

        this.runCustom( method_names, parent, prop, obj, main );

	}

	////////////////////////////////////
	// custom method
	// 
	/**
	 * [runCustom description]
	 * @param  {[type]} method_name [description]
	 * @param  {[type]} parent      [description]
	 * @param  {[type]} prop        [description]
	 * @param  {[type]} obj         [description]
	 * @return {[type]}             [description]
	 */
	runCustom( method_names, parent, prop, obj, main ){
		let conf = this.conf;
		method_names.forEach( function( method_name ){
			if( null != conf[ method_name ] ){
				if( null == obj ) obj = parent.select( "." + this.name );

				conf[ method_name ]( obj, prop, conf, main );
			}
		}.bind(this) );
	}

}