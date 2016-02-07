import d3 from 'd3';

/**
 * D3Wrapper Class
 */
export class D3Element {

  /**
   * D3Element
   * @param  {[type]} name   [description]
   * @param  {[type]} conf   [description]
   * @param  {[type]} childs [description]
   * @return {[type]}        [description]
   */
  constructor( name, conf, childs ){
    this.name = name;
    this.conf = ( null == conf ? {} : conf );
    this.childs = (null == childs ? [] : childs );

    this.init();
  }

  /**
   * Initial function (when this class newing )
   * It can overwritted when you need a init code
   * @return {[type]} [description]
   */
  init(){};

  /**
   * Run action
   * @param  {[Array<String> or String]} method_name [description]
   * @param  {[type]} parent      [description]
   * @param  {[type]} prop        [description]
   * @return {[type]}             [description]
   */
  run( method_name, parent, prop ){
    var method_names = method_name;
    if( !Array.isArray( method_name ) ){
      method_names = [ method_name ];
    }

    method_names.forEach( function( method_name ){

      var next_parent = parent;
      if( this.__checkIsfunction( this[method_name] ) ){
        next_parent = this[method_name]( parent, prop );
      }
      this.__callChild( method_name, next_parent, prop );  

    }.bind(this));
    
  }

  /**
   * child method Call
   * @param  {[type]} method_name [description]
   * @param  {[type]} parent      [description]
   * @param  {[type]} prop        [description]
   * @return {[type]}             [description]
   */
  __callChild( method_name, parent, prop ){

    this.childs.forEach( function( item ){
      item.run.bind(item)( method_name, parent, prop );
    }.bind(this) );

  }

  __checkIsfunction( f ){
    return ( null != f && f.constructor === Function )
  }
}