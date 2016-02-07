import { D3Shape, D3Layer } from 'react-d3-helper'

/// Object Define
export function getNodeLayer( CIRCLE_R, type ){

  if( null == type ) type = 0;  // 0 = graph, 1 = tree

  var circle_conf = {
    appendtype: "circle",
    appending: function( obj, prop, conf, main ){

      obj
        .attr( "r", prop.CIRCLE_R )
        .style("fill",
          function(d) { 
            if( prop.state.selectedNode != null && 
                prop.state.selectedNode.id == d.id ){
              return "#00ff00";
            }else{
              return d._children ? "lightsteelblue" : "#fff";   
            }
          })
        .call( main.layout.drag );
    },
    ticking: function( obj, prop ){
      obj
        .attr( "cx", function(d) { return d.x } )
        .attr( "cy", function(d) { return d.y } );
    },
    begining: function( obj, prop, conf, main ){
      obj.attr("r", 3)
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
    }
  };

  var text_conf = {
    appendtype: "text",
    appending: function( obj, prop ){
      obj
        .attr("text-anchor", "middle")
        .text(function(d) { return d.name; })
        .style("fill-opacity", 1);
    },
    ticking: function( obj, prop ){
      obj
        .attr( "x", function(d) { return d.x } )
        .attr( "y", function(d) { return d.y } );
    },
    begining: function( obj, prop, conf, main ){
      obj.attr("text-anchor", "middle")
          .text(function(d) { return d.name; })
          .style("fill-opacity", 1e-6);
    },
    eventadding: function( obj, prop ){
      obj.on("click", function(d){
                        prop.dispatcher.emit( "node:mouseclick", d );
                      }.bind(this));
    }
  };
  
  let radius = CIRCLE_R;
  let border = 5;

  var progress_conf = {
    appendtype: "path",
    appending: function( obj, prop, conf ){
      obj
        .attr('fill', '#E1499A')
        .attr('fill-opacity', 1)
        .attr('stroke', '#E1499A')
        .attr('stroke-width', 5)
        .attr('stroke-opacity', 1)
        .attr('x', function(d){ return d.y } )
        .attr('y', function(d){ return d.x } )
        .attr( "d", function(d){
          return conf.arc.endAngle( conf.twoPi * d.progress / 100 )();
        }.bind(this))
    },
    ticking: function( obj, prop, conf ){
      obj
        .attr('fill', '#E1499A')
        .attr('fill-opacity', 1)
        .attr('stroke', '#E1499A')
        .attr('stroke-width', 5)
        .attr('stroke-opacity', 1)
        //.attr('x', function(d){ return d.x } )
        //.attr('y', function(d){ return d.y } )
        .attr( "d", function(d){
          return conf.arc.endAngle( conf.twoPi * d.progress / 100 )();
        }.bind(this))
        .attr("transform", function(d){
          return "translate("+ d.x + ", " + d.y + ")";
        })
    },
      // additional config ( you can use it in appending and ticking )
    arc: d3.svg.arc()
          .startAngle(0)
          .innerRadius(radius)
          .outerRadius(radius - border),
    twoPi: Math.PI * 2,

    begining: function( obj, prop, conf, main ){
      obj.attr('fill', '#E1499A')
        .attr('fill-opacity', 0)
        .attr('stroke', '#E1499A')
        .attr('stroke-width', 0)
        .attr('stroke-opacity', 0.1)
    }
  };

  var node_layer_config = [];

  node_layer_config[0] = {
    dataprocess: function( obj, data, prop, conf ){

      return obj.data( data.graphData.nodes, function(d){ return d.id; } );
    },
    enter: function( obj, data, prop, conf ){
      var ret = obj.append("g");

      if( 1 == type ){
        ret.attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; });
      }
      return ret;
    }
  };

  node_layer_config[1] = {
    dataprocess: function( obj, data, prop, conf ){

      return obj.data( data.nodes, function(d){ return d.id; } );
    },
    appending: function( obj, prop ){
      obj.duration( prop.DURATION )
        .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });
    }
  };

  return new D3Layer( 
                      "node", 
                      node_layer_config[type], 
                      [
                        new D3Shape( "node_circle", circle_conf ),
                        new D3Shape( "node_text", text_conf ),
                        new D3Shape( "node_progress", progress_conf )
                      ]
                    );
}

export function getLinkLayer(){

  var link_config = {
    appendtype: "line",
    appending: function( obj, prop ){
      obj
        .style("stroke", function(d){
          if( d.sourceid + "--" + d.targetid == prop.state.selectedLink ){
            return "#ff0000";
          }else{
            return "#ccc";
          }
        })
        .style("stroke-width",5)
        .on("click", function( d ){
          prop.dispatcher.emit( "link:mouseclick", d );
        });
    },
    ticking: function( obj, prop ){
      obj
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    }
  };

  var link_layer_config = {
    dataprocess: function( obj, data, prop, conf ){

      return obj.data( data.graphData.links, 
                function(d){

                  return d.source.id + "-" + d.target.id;
                }
              );
    }
  };

  return new D3Layer( 
                      "link", 
                      link_layer_config, 
                      [
                        new D3Shape( "link", link_config )
                      ]
                    );

}

export function getSelectedLayer( CIRCLE_R ){

  var gotext_config = {
    appendtype: "text",
    appending: function( obj, prop ){
      obj
        .attr("text-anchor", "middle")
        .text( function(d){
          return "Go";
        })
        .on("click", function(d){
          prop.dispatcher.emit( "gotext:mouseclick", d);
        });
    },
    ticking: function( obj, prop ){
      obj
        .attr( "x", function(d) { return d.x } )
        .attr( "y", function(d) { return d.y + CIRCLE_R + 13 } );
    }
  }

  var selected_node_layer_config = {
    dataprocess: function( obj, data, prop, conf ){
      return obj.data( ( null != data.selectedNode ? [data.selectedNode] : [] ) );
    }
  };

  return new D3Layer( 
                      "selected_node", 
                      selected_node_layer_config, 
                      [
                        new D3Shape( "selected_gotext", gotext_config )
                      ]
                    );
}