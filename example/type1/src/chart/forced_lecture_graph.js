import React from 'react';

// react-bootstrap
import D3Chart from './forced_lecture_graph_d3';

var graphData = {
                  nodes:[
                            { name:"CS",          id:"CS",          progress:100  , url:"http://google.com" },
                            { name:"Algorithm",   id:"Algorithm",   progress:30   , url:"http://google.com" },
                            { name:"DataStruct",  id:"DataStruct",  progress:20   , url:"http://google.com" },
                            { name:"DataBase",    id:"DataBase",    progress:60   , url:"http://google.com" },
                            { name:"Web",         id:"Web",         progress:70   , url:"http://google.com" },
                            { name:"Math",        id:"Math",        progress:20   , url:"http://google.com" }
                        ], 
                  links:[
                      { sourceid: "CS",         targetid: "Algorithm" },
                      { sourceid: "Algorithm",  targetid: "DataStruct" },
                      { sourceid: "Algorithm",  targetid: "Math" },
                      { sourceid: "DataStruct", targetid: "DataBase" },
                      { sourceid: "DataBase",   targetid: "Web" }
                      ] 
                };

export default class ForcedLectureGraph extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      graphData: graphData,
      selectedNode: null,
      selectedLink: null,
      showAddModal:false,
      showLinkModal:false,
    }
  }

  componentDidMount() {
    // add Window Resize Event
    window.addEventListener( 'resize', this.handleResize.bind(this) );
  }

  getChartState() {
    return {
      graphData: this.state.graphData,
      selectedNode: this.state.selectedNode,
      selectedLink: this.state.selectedLink
    };
  }

  componentWillUnmount() {
    // add Window Resize Event
    window.removeEventListener( 'resize', this.handleResize.bind(this) );
  }

  showAddNodeModal(){
    this.setState({showAddModal:true});
  }
  closeAddNodeModal(){
    this.setState({showAddModal:false});
  }

  showAddLinkModal(){
    this.setState({showLinkModal:true});
  }
  closeAddLinkModal(){
    this.setState({showLinkModal:false});
  }

  handleResize(){
    // resizing ( hmm is it works? )
    this.setState({});
  }

  render() {
    return (
      <div>
        <D3Chart data={ this.getChartState() } d3_events={ this.getEvents() }></D3Chart>
      </div>
    );
  }

  getEvents(){
    return [
      { name: 'node:mouseclick',    cb: this.setSelectNode.bind(this) },
      { name: 'link:mouseclick',    cb: this.setSelectLink.bind(this) },
      { name: 'gotext:mouseclick',  cb: this.goLink.bind(this) }
    ];
  }

  // test Selected mode
  setSelectNode(d){
    this.setState( {  selectedNode: d,
                      selectedLink: null } );
    this.props.onChangeSelectNode( d.id );
  }

  setSelectLink(d){
    var selectedLinkID = d.sourceid + '--' + d.targetid;
    this.setState( { selectedNode: null, 
                     selectedLink: selectedLinkID } );
    this.props.onChangeSelectNode( selectedLinkID );
  }

  goLink(d){
    window.open( d.url );
  }

};
