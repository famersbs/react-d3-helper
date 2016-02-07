import d3 from 'd3';
import EventEmitter from 'events';

import { D3Element, D3ReactComponent } from 'react-d3-helper';

export default class TreeChart extends D3ReactComponent {

  create( state ) {

    // Define Default Vars
    this.CIRCLE_R = 50;
    this.MARGIN_BTN_CIRCLE = 10;
    this.HEIGHT_MARGIN = 200;
    this.DURATION = 750;

    this.tree = d3.layout.tree();

    this.diagonal = d3.svg.diagonal()
                      .projection( function(d){
                        return [d.y, d.x];
                      });

    this.svg = d3.select( this.getDOMNode() )
                  .append("svg")

    this.g = this.svg.append("g");

    // Make elements
    this.tree_element = new TreeController();

    this.update( state );
  };

  // In force layout are always recreate every objects
  update( state ) {

    if( state.treedata.length == 0 ) return;

    // Set window size
    this.width = window.innerWidth;
    this.height = window.innerHeight - this.HEIGHT_MARGIN;

    this.tree.size( [ this.height, this.width ] );

    this.svg
          .attr( "width", this.width )
          .attr( "height", this.height );

    // preparing data 
    var root = state.treedata[0];
    root.x0 = this.height / 2;
    root.y0 = 0;

    var nodes = this.tree.nodes(root).reverse();
    var links = this.tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) { 
      d.y = this.CIRCLE_R + 
            this.MARGIN_BTN_CIRCLE +
            ( d.depth * (this.CIRCLE_R * 2  + this.MARGIN_BTN_CIRCLE ) ); 
    }.bind(this));

    // Render Objects
    var props = { 
                  source: root,
                  state: state, 
                  dispatcher: this.getDispatcher(),
                  CIRCLE_R: this.CIRCLE_R,
                  DURATION: this.DURATION,
                  diagonal: this.diagonal,
                  width: this.width, 
                  height: this.height,
                  nodes: nodes,
                  links: links,
                  selectedNode: state.selectedNode
                };

    this.tree_element.run( ["enter", "update", "exit"], this.svg, props );

      // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  };

  destroy() {
  };
}

class TreeController extends D3Element {

  init(){

    this.CIRCLE_R = 50;
    //this.MARGIN_BTN_CIRCLE = 10;
    //this.HEIGHT_MARGIN = 200;
    //this.DURATION = 750;
    //
    let radius = this.CIRCLE_R;
    let border = 5;

    var node_element = new NodeElement("node", {}, 
                                          [ 
                                            new TreeCircleElement("circle", {}, []),
                                            new TreeNameElement("text", {}, [] ),
                                            new TreeProgressElement( "progress", 
                                                {
                                                  arc: d3.svg.arc()
                                                        .startAngle(0)
                                                        .innerRadius(radius)
                                                        .outerRadius(radius - border),
                                                  twoPi: Math.PI * 2
                                                }, [])
                                          ]);

    var link_element = new TreeLinkElement("tree_link", {}, [] );
    
    this.childs = [ node_element, link_element ];

  };

}

//Define Element
class NodeElement extends D3Element {

  enter( parent, prop ){
    this.element = parent.selectAll( "." + this.name )
                          .data( prop.nodes, function(d){ return d.id; } );

    this.element_enter = this.element.enter().append("g")
                              .attr("class", this.name)
                              .attr("transform", function(d) { return "translate(" + prop.source.y0 + "," + prop.source.x0 + ")"; })
                              .on("click", function(d){
                                prop.dispatcher.emit( "node:mouseclick", d );
                              });
    
    return this.element_enter;
  }

  update( parent, prop ){

    this.element_update = this.element.transition()
                              .duration(prop.DURATION)
                              .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

    return this.element_update;
  }

  exit( parent, prop ){
    return this.element.exit().transition()
                        .duration( prop.DURATION )
                        .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                        .remove();
  }
}

class TreeCircleElement extends D3Element {
  enter( parent, prop ){
    return parent.append( "circle" )
          .attr("class", this.name )
          .attr("r", 3)
          .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
  }

  update( parent, prop ){
    return parent.select("." + this.name )
          .attr( "r", prop.CIRCLE_R )
          .style("fill",
            function(d) { 
              if( prop.state.selectedNode != null && 
                  prop.state.selectedNode.id == d.id ){
                return "#00ff00";
              }else{
                return d._children ? "lightsteelblue" : "#fff";   
              }
          });
  }
  exit( parent, prop ){
      return parent.select("." + this.name )
                    .attr("r", 1e-6);
  }
}

class TreeNameElement extends D3Element {
  enter( parent, prop ){
    return parent.append( "text" )
          .attr("class", this.name )
          .attr("text-anchor", "middle")
          .text(function(d) { return d.name; })
          .style("fill-opacity", 1e-6);
  }

  update( parent, prop ){
    return parent.select("." + this.name )
          .style("fill-opacity", 1);
  }
  exit( parent, prop ){
      return parent.select("." + this.name )
                    .style("fill-opacity", 1e-6);
  }
}

class TreeProgressElement extends D3Element {
  enter( parent, prop ){
    return parent.append( "path" )
          .attr("class", this.name )
          .attr('fill', '#E1499A')
          .attr('fill-opacity', 0)
          .attr('stroke', '#E1499A')
          .attr('stroke-width', 0)
          .attr('stroke-opacity', 0.1)
          .attr( "d", function(d){
            return this.conf.arc.endAngle( this.conf.twoPi * d.progress / 100 )();
          }.bind(this) )
  }

  update( parent, prop ){
    return parent.select("." + this.name )
          .attr('fill', '#E1499A')
          .attr('fill-opacity', 1)
          .attr('stroke', '#E1499A')
          .attr('stroke-width', 5)
          .attr('stroke-opacity', 1)
          .attr( "d", function(d){
            return this.conf.arc.endAngle( this.conf.twoPi * d.progress / 100 )();
          }.bind(this))
  }
  exit( parent, prop ){
      return parent.select("." + this.name )
                    .attr('stroke-opacity', 0)
                    .attr('fill-opacity', 0);
  }
}

class TreeLinkElement extends D3Element {
  enter( parent, prop ){
    this.element = parent.selectAll( "." + this.name )
          .data( prop.links, function(d){ return d.target.id; });

    return this.element_enter = this.element.enter().insert("path", "g")
                            .attr( "class", this.name )
                            .attr( "fill", "none" )
                            .attr( "stroke", "#ccc" )
                            .attr( "stroke-width", "2px" )
                            .attr("d", function(d){
                              var o = {x: prop.source.x0, y: prop.source.y0};
                              return prop.diagonal({source: o, target: o});
                            });
  }

  update( parent, prop ){
    return this.element.transition()
                .duration( prop.DURATION )
                .attr("d", prop.diagonal );
  }
  exit( parent, prop ){
      return this.element.exit().transition()
                  .duration(prop.DURATION)
                  .attr("d", function(d) {
                    var o = {x: source.x, y: source.y};
                    return prop.diagonal({source: o, target: o});
                  }.bind(this))
                  .remove();
  }
}

