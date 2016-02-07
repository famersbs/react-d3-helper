import React from 'react';

// react-bootstrap
import {Button} from 'react-bootstrap';
import {ButtonToolbar} from 'react-bootstrap';
import {Modal} from  'react-bootstrap';
import {Input} from 'react-bootstrap';
import {Navbar} from 'react-bootstrap';
import {Nav} from 'react-bootstrap';
import {NavItem} from 'react-bootstrap';
import {Well} from 'react-bootstrap';

import D3Chart from './forced_lecture_graph_d3';
import dataModel from './forced_lecture_graph_model';

var graphData = { nodes:[], links:[] };

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

    // create model
    this.model = new dataModel();
  }

  componentDidMount() {

    // Load Data
    this.model.getFullData()
      .then( function( data ){
        graphData = data;
        this.setState({ graphData: graphData });
      }.bind(this) )
      .catch(function(error){
        console.log("Error...", error.stack);
      });

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

  renderRemoveItem(){
    if( null != this.state.selectedNode ){
      return <NavItem eventKey={3} onClick={ this.removeSelectedNode.bind(this)  }>Remove Node</NavItem>;
    }else if( null != this.state.selectedLink ){
      return <NavItem eventKey={4} onClick={ this.removeSelectedLink.bind(this)  }>Remove Link</NavItem>;
    }
  }

  render() {
    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Force Graph</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Nav>
            <NavItem eventKey={1} onClick={ this.showAddNodeModal.bind(this)  } >Add Node</NavItem>
            <NavItem eventKey={2} onClick={ this.showAddLinkModal.bind(this)  }>Add Link</NavItem>
            {
              this.renderRemoveItem()
            }
          </Nav>
        </Navbar>
        <Modal show={this.state.showAddModal} onHide={ this.closeAddNodeModal.bind(this) } >
          <Modal.Header closeButton> Add Node </Modal.Header>
          <Modal.Body>
            <form>
              <Input ref='newNodeName' type="text" label="Node Name" placeholder="Enter Node name" />
              <Input ref='newNodeUrl' type="text" label="Node Url" placeholder="Enter Node Url" />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={ this.addNode.bind(this) } >Add</Button>
          </Modal.Footer>
        </Modal>
        <Modal show={this.state.showLinkModal} onHide={ this.closeAddLinkModal.bind(this) } >
          <Modal.Header closeButton> Add Link </Modal.Header>
          <Modal.Body>
            <form>
              <Input ref='newLinkSource' type="text" label="Node Source Name" placeholder="Source" />
              <Input ref='newLinkTarget' type="text" label="Node Target Name" placeholder="Target" />
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={ this.addLink.bind(this) } >Add</Button>
          </Modal.Footer>
        </Modal>
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

  addNode(){

    this.model.addNode( this.refs.newNodeName.getValue(),
                        this.refs.newNodeUrl.getValue() 
        )
        .then( function(data){
          var new_node = {
              name:this.refs.newNodeName.getValue(),
              id:this.refs.newNodeName.getValue(),
              url:this.refs.newNodeUrl.getValue(),
              progress:10
            };

            graphData.nodes.push( new_node );
            this.setState( {graphData: graphData} );
        }.bind(this))
        .catch( function(e){
          console.log("Device control failed",e);
        }.bind(this))
        .then( function(){
          this.closeAddNodeModal();
        }.bind(this));
  }

  removeSelectedNode(){

    var selectedNodeID = this.state.selectedNode.id;
    this.model.removeNode( selectedNodeID )
        .then( function(data){

          // first find node and remove
          graphData.nodes = graphData.nodes.filter( function( value ){
            return ! (value.id == selectedNodeID);
          });

          // second find links which include selected node
          graphData.links = graphData.links.filter( function(value){
            return ( value.sourceid != selectedNodeID &&
                      value.targetid != selectedNodeID );
          });

          this.setState( { selectedNode: null, 
                           graphData: graphData } );

        }.bind(this))
        .catch( function(e){
          console.log("Device control failed",e);
        }.bind(this));
  }

  addLink(){
    var source = this.refs.newLinkSource.getValue();
    var target = this.refs.newLinkTarget.getValue();

    this.model.addLink( source, target )
        .then( function(data){

          var new_link = {
              sourceid: this.refs.newLinkSource.getValue(),  
              targetid: this.refs.newLinkTarget.getValue()
          }

          graphData.links.push( new_link );
          this.setState( {graphData: graphData} );

        }.bind(this))
        .catch( function(e){
          console.log("Device control failed",e);
        }.bind(this))
        .then( function(){
          this.closeAddLinkModal();
        }.bind(this));
  }

  removeSelectedLink() {

    var selectedLinkIDs = this.state.selectedLink.split("--");

    this.model.removeLink( selectedLinkIDs[0], selectedLinkIDs[1] )
        .then( function(data){

          var links = graphData.links;
          // second find links which include selected node
          graphData.links = links.filter( function(value){
            return !( value.sourceid == selectedLinkIDs[0] && value.targetid == selectedLinkIDs[1] );
          });

          this.setState( { selectedLink: null, 
                            graphData: graphData } );

        }.bind(this))
        .catch( function(e){
          console.log("Device control failed",e);
        }.bind(this));
  }

};
