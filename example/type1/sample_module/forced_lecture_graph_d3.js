import d3 from 'd3';
import EventEmitter from 'events';

import { D3ReactComponent } from '../d3-builder'
import { getLinkLayer, getNodeLayer, getSelectedLayer } from './shapes'

export default class ForcedLectureGraph_D3 extends D3ReactComponent {

  create( state ) {

    // Define Default Vars
    this.CIRCLE_R = 50;
    this.MARGIN_BTN_CIRCLE = 10;
    this.LINK_DISTANCE = 150;
    this.HEIGHT_MARGIN = 200;
   
    this.layers =  [
                      getLinkLayer(),
                      getNodeLayer( this.CIRCLE_R ),
                      getSelectedLayer( this.CIRCLE_R )
                    ];
  };

  // In force layout are always recreate every objects
  update( state ) {

    // Set window size
    this.width = window.innerWidth;
    this.height = window.innerHeight - this.HEIGHT_MARGIN;

    // preparing data 
    
      // set order between nodes
    this.__preparingData( state.graphData );

      // fill links source and target
    this.__fillLinks( state );

    // clearing 
    if( null != this.svg ){
      this.svg.remove();
    }

    // create
    this.layout = d3.layout.force()
                    .linkDistance( [ this.LINK_DISTANCE ] )
                    .gravity( 0.0 )
                    .size( [ this.width, this.height ] )
                    .nodes( state.graphData.nodes )
                    .links( state.graphData.links )
                    .start();

    this.svg = d3.select( this.getDOMNode() )
                  .append("svg")
                  .attr( "width", this.width )
                  .attr( "height", this.height );

    this.g = this.svg.append("g")
                      .attr('class', 'forced_chart');

        // Render Objects
    var props = { 
                        state: state, 
                        //layout: this.force, 
                        dispatcher: this.getDispatcher(),
                        CIRCLE_R: this.CIRCLE_R,
                        width: this.width, 
                        height: this.height
                      };

    // updating
    this.layers.forEach( function(item){
      item.entering( ["appending","eventadding"], this.g, props, state, this );
    }.bind(this));


    // add Tick event
    this.layout.on("tick", function() {

      // bounder Check
      this.bounderCheck( state.graphData.nodes , this.width, this.height, this.CIRCLE_R);

      // Collide detecting
      var q = d3.geom.quadtree( state.graphData.nodes ),
          i = 0,
          n = state.graphData.nodes.length;
      while (++i < n) q.visit( this.collide( state.graphData.nodes[i], this.CIRCLE_R));

      // adjust x, y 
      var render_item = {
                          state: state, 
                          dispatcher: this.getDispatcher(),
                          CIRCLE_R: this.CIRCLE_R
                        };

      this.layers.forEach( function(item){
        item.runCustom( ["ticking"], null, render_item );
      });
     
    }.bind(this));

    // exiting
    this.layers.forEach( function(item){
      item.exiting();
    });

  };

  

  destroy() {
    /*
    // clearing 
    if( null != this.svg ){
      this.svg.remove();
    }
     */
  };


  ///////////////////////////////////////////////////////////////
  // private function
  __fillLinks( state ){
    // Fill Links
    for( var i = 0 ; i < state.graphData.links.length ; ++ i ){
      var cur_link = state.graphData.links[i];

      if( null == cur_link.source ){
        function findNode( id ){
          for( var j = 0 ; j < state.graphData.nodes.length; ++ j ){
            var cur_node = state.graphData.nodes[j];
            if( cur_node.id == id ) return cur_node;
          }
        }
        cur_link.source = findNode( cur_link.sourceid );
        cur_link.target = findNode( cur_link.targetid );
      }
    }

  }

  __preparingData( data ){
    
    if( this.DataWasPrepared || 
        null == data.nodes || 
        data.nodes.length == 0 ) return;

    this.DataWasPrepared = true;

    // Make order ( id to idx )
    var ordered = [];

    data.nodes.map( ( val, idx ) => {
      ordered[val.id] = idx;
    } );

    // Calc depth and set initial position
      // Depth counting
    var depth_q = [];
    depth_q.push( { node: data.nodes[0], depth: 0 } );

    while(depth_q.length > 0 ){
      var cur = depth_q.shift();

      if( null != cur.__depth ) continue;

      cur.node.__depth = cur.depth;
      cur.node.x = this.CIRCLE_R + 3 + ( cur.depth * ( this.CIRCLE_R + this.LINK_DISTANCE ) );

      // find child and push
      data.links.forEach( val => {

        if( val.sourceid == cur.node.id ){
          var target = data.nodes[ ordered[val.targetid] ];
          
          if( null != target && null == target.__depth ){

            depth_q.push( {node: target, depth: cur.depth + 1 } );
          }
        }

      });
    }
  }

bounderCheck( nodes, width, height, CIRCLE_R ){

  if( nodes.length <= 0 ) return;

    // Fixed node[0]
    nodes[0].x = CIRCLE_R + 3;
    nodes[0].y = height /2;

    // If other nodes are moved to out of the screen, it should fix
    for( var i = 1 ; i < nodes.length; ++ i ){

      var cur_node = nodes[i];

      if( cur_node.x - CIRCLE_R < 0 ){
        cur_node.x = CIRCLE_R + 3;
      }
      if( cur_node.x + CIRCLE_R > width ){
        cur_node.x = width - CIRCLE_R - 3;
      }

      if( cur_node.y - CIRCLE_R < 0 ){
        cur_node.y = CIRCLE_R + 3;
      }
      if( cur_node.y + CIRCLE_R > height ){
        cur_node.y = height - CIRCLE_R - 3;
      }

    }
  }

  collide(node, CIRCLE_R) {
    var r = CIRCLE_R,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r
        //circle_r = CIRCLE_R;

    return function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== node)) {
              var x = node.x - quad.point.x,
                  y = node.y - quad.point.y,
                  l = Math.sqrt(x * x + y * y),
                  r = CIRCLE_R * 2;
              if (l < r) {
                l = (l - r) / l * .5;
                node.x -= x *= l;
                node.y -= y *= l;
                quad.point.x += x;
                quad.point.y += y;
              }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
  }
}

