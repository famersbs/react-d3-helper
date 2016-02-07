import React from 'react';

import GraphChart from './chart/forced_lecture_graph';

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
      <GraphChart
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