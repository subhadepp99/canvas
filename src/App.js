import React,{Component} from 'react';

import './App.css';


import Content from "./components/content";





const defaultColor = "black";
const defaultTool = "Rectangle";



const toolbarItems = [
 
  { name: "Rectangle", image: '' }
  
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: defaultColor,
      selectedItem: defaultTool,
      toolbarItems: toolbarItems,
      contentData:null
    };
    this.changeColor = this.changeColor.bind(this);
    this.changeTool = this.changeTool.bind(this);
  }

  changeColor(event) {
    this.setState({ color: event.target.style.backgroundColor });
  }

  changeTool(event, tool) {
    this.setState({ selectedItem: tool });
  }



  render(){
    return (
      <React.Fragment>
       
        <Content
          items={this.state.toolbarItems}
          activeItem={this.state.selectedItem}
          handleClick={this.changeTool}
          color={this.state.color}
        />
       
      </React.Fragment>
    );
  }
 
}

export default App;
