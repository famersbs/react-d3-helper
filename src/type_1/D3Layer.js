/**
 * 
 */
export class D3Layer {

	/**
	 * D3Layer
	 * @param  {[String]} name   [description]
	 * @param  {[ Array[D3Shape] ]} [Children]
	 * @return {[none]}        [description]
	 */
	constructor( name, conf, childes ){
		this.name = name;
		this.conf = conf;
		this.childes = childes;
	}

	// Default Eventing
	entering( method_names, parent, prop, data, main ){
		var conf = this.conf;

		if( null != conf.dataprocess ){

			this.main = conf.dataprocess( 	parent.selectAll( "." + this.name ), 
											data, 
											prop, 
											conf );
		
			if( null == conf.enter ){
				this.mainEnter = this.main.enter().append("g");
			}else{
				this.mainEnter = conf.enter( this.main.enter(), data, prop, conf );
			}

			this.mainEnter.attr("class", this.name );
			
			/*
			this.mainEnter = this.main.enter().insert("path","g")
											.attr("class", this.name );
			*/
										
			this.childes.forEach( function( item ){
				item.append( method_names, this.mainEnter, prop, main );
			}.bind(this) );

		}
	}

	transitioning( method_names, parent, prop, main ){
		this.mainTransition = this.main.transition();

		method_names.forEach( function( method_name ){
			if( null != this.conf[method_name]){
				this.conf[method_name]( this.mainTransition, prop );
			}
		}.bind(this))
		
    	this.runCustom( method_names, this.mainTransition, prop );
	}

	exiting( run_method_name ){
		if( null == this.main ) return;
		var mainExit = this.main.exit().remove();
	}

	remove(){
		if( null == this.main ) return;
		this.main.remove();
	}

	// custom eventing
	runCustom( method_names, parent, prop ){

		if( null == parent ){
			parent = this.mainEnter;
		}

		this.childes.forEach( function( item ){
			item.runCustom.bind(item)( method_names, parent, prop);
		}.bind(this));
	}

}