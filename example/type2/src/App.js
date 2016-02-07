import React from 'react';
//import _ from 'lodash'
//import $ from 'jquery'
//import cuid from 'cuid'

import TreeChart from './chart/Chart';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedNode: null,
    }
  }

  componentDidMount() {
  }

  render() {    

    // Render
    return (
      <TreeChart
            width="100%"
            height="500"
            onChangeSelectNode={this.onChangeSelctNode.bind(this)} />
    );
  }
  onChangeSelctNode(id){
    this.setState({selectedNode:id});
    console.log( "Selected Node", id );
  }

}

export default App;