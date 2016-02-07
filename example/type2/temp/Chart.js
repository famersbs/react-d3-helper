import React from 'react';
import ReactDOM from 'react-dom';

import TreeChart from './Chart_d3';

import cuid from 'cuid';

var treeData = [
                  {
                    "id": cuid(),
                    "name": "Top Level",
                    "parent": "null",
                    "progress": 100,
                    "children": [
                      {
                        "id": cuid(),
                        "name": "Level 2: A",
                        "parent": "Top Level",
                        "progress": 50,
                        "children": [
                          {
                            "id": cuid(),
                            "name": "Son of A",
                            "parent": "Level 2: A",
                            "progress": 20,
                          },
                          {
                            "id": cuid(),
                            "name": "Daughter of A",
                            "parent": "Level 2: A",
                            "progress": 0,
                          }
                        ]
                      },
                      {
                        "id": cuid(),
                        "name": "Level 2: B",
                        "parent": "Top Level",
                        "progress": 10,
                      }
                    ]
                  }
                ];

export default class Chart extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      treedata: treeData,
      selectedNode: null,
    }

  }

  componentDidMount() {
    // Load Data
    $.get('api/front', function( data ){
      treeData = data;
      this.setState({ treedata: treeData });
    }.bind(this) );

    // add Window Resize Event
    window.addEventListener( 'resize', this.handleResize.bind(this) );

  }

  componentDidUpdate() {
  }

  getChartState() {
    return {
      treedata: this.state.treedata,
      selectedNode: this.state.selectedNode
    };
  }

  handleResize(){
    // resizing ( hmm is it works? )
    this.setState({});
  }

  componentWillUnmount() {
    window.removeEventListener( 'resize', this.handleResize.bind(this) );
  }

  render() {
    return (
      <div>
          <TreeChart data={this.getChartState()} d3_events={this.getEvents()} ></TreeChart>
      </div>
    );
  }

  getEvents() {
    return [{ name: 'node:mouseclick', cb:this.setSelectNode.bind(this)}];
  }

  // test Selected mode
  setSelectNode(d){
    this.setState( { selectedNode: d } );
    this.props.onChangeSelectNode( d.id );
  }

  findNode( id ) {

    var findNode = function( pnode, id ){
      for( var i = 0 ; i < pnode.length ; ++ i ){
        var node = pnode[i];
        if( node.id == id ){
          return node;
        }else if( undefined != node.children && null != node.children ){
          var ret = findNode( node.children, id );
          if( null == ret ) continue;
          else return ret;
        }
      }
      return null;
    }
    return findNode( treeData, id );
  }

  addNode(){

    if( null == this.state.selectedNode ) return;

    var child_node = {
      name: this.refs.newNodeName.value ,
      progress: 10,
      id: cuid()
    }

   var node = this.findNode( this.state.selectedNode );

   if( null != node ){
    if( undefined == node.children || null == node.children ){
      node.children = [];
    }
    node.children.push( child_node );
    this.setState( { treedata: treeData } );

    console.log( treeData );
    return true;
   }else{
    return false;
   }
  }

};