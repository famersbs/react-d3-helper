import d3 from 'd3';
import React from 'react';
import ReactDOM from 'react-dom';

import EventEmitter from 'events';
import cuid from 'cuid';

/**
 * 
 */
export class D3ReactComponent extends React.Component {

	constructor(props){
		super(props);
		
		// Define State
		this.state = {
			element_classname : "D3Chart_" + cuid()
		};

		// Adding onEvents from parent
		this.dispatcher = new EventEmitter();
		

		// layers management
		this.layers = [];
	}

	// Default React Render and Events
	render(){
		return <div className={this.state.element_classname} />
	}

	componentDidMount() {

		// add Event
		this.__addOnEvents( this.props.d3_events );

		// Create Chart
		this.create( this.props.data );

	}

	componentDidUpdate() {
		this.update( this.props.data );
	}

	componentWillUnmount() {
		// Events remove
		this.__releaseOnEvents( this.props.d3_events );

		// Destory Chart
		this.destroy();
	}

	// Get
	getDispatcher(){
		return this.dispatcher;
	}
	getDOMNode() {
		return ReactDOM.findDOMNode( this );
  	}

	// Inner utility
	emit( event_name, data ){
		this.dispatcher.emit( event_name, data );
	}


	/////////////////////////////////////////////
	// should be overwritted.
	create( state ){ this.__throw_overwrite_error( "create" ) ;}
	update( state ){ this.__throw_overwrite_error( "update" ) ;}
	destroy(){  this.__throw_overwrite_error( "destory" ) ;}

	////////////////////////////////////////////
	// private functions
	__addOnEvents( events ){

		if( null == this.props.d3_events ) return;

		var dispatcher = this.getDispatcher();
		events.forEach( function(item){
			dispatcher.on( item.name, item.cb );
		});
	}
	__releaseOnEvents( events ){

		if( null == this.props.d3_events ) return;

		var dispatcher = this.getDispatcher();
		events.forEach( function(item){
			dispatcher.removeListener( item.name, item.cb );
		});
	}
	__throw_overwrite_error( func_name ){
		throw new Error("This function should be Overwritted : " + func_name );
	}
}