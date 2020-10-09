
import React, { Fragment } from "react";
import  '../styles/content.css';
import  '../styles/menubar.css';
import axios from "axios";
import '../styles/spinner.css';


export default class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawing: false,
      offsetX: 0,
      offsetY: 0,
      startX: 0,
      startY: 0,
      contentData:'null',
      save:false,
      issaved:false,isopened:false,
      open:false,
      contents:[],val:''
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.canvasRef = React.createRef();
    this.canvasOverlayRef = React.createRef();
    this.ctx = null;
    this.overlayCtx = null;
    
  }
 
  componentDidMount() {
    let canvasRef = this.canvasRef.current;
    let canvasOverlayRef = this.canvasOverlayRef.current;
    let canvasRect = canvasRef.getBoundingClientRect();

    this.ctx = canvasRef.getContext("2d");
    this.ctxOverlay = canvasOverlayRef.getContext("2d");
    if(this.state.contentData)
    {

    }
    else{
      this.setState({ offsetX: canvasRect.left, offsetY: canvasRect.top });
    }

    axios.get('https://react-my-burger-fb977.firebaseio.com/canvas.json')
    .then(res=>{
   
      let allfiles=[];
      for(let key in res.data){
        allfiles.push({
          ...res.data[key],
          id:key
        })
      }
     
      this.setState({contents:allfiles});
    // console.log(this.state.contents);
     
     //console.log(allfiles[1].datas);
  
  
  
    })
    .catch(err=>{
    console.log('error');
    });
  
   
   
  }

  

  handleMouseDown(e) {
    let ctx = this.ctx;
    let ctxOverlay = this.ctxOverlay;
    let activeItem = this.props.activeItem;

    this.setState({ isDrawing: true });
    ctx.beginPath();
    ctx.strokeStyle = this.props.color;
    ctx.lineWidth = 1;
    ctx.lineJoin = ctx.lineCap = "round";

   if ( activeItem === "Rectangle") {
      ctxOverlay.strokeStyle = this.props.color;
      ctxOverlay.lineWidth = 1;
      ctxOverlay.lineJoin = ctx.lineCap = "round";
      this.setState({
        startX: e.clientX - this.state.offsetX,
        startY: e.clientY - this.state.offsetY
      });
    }
   // console.log(this.state);
  }

  handleMouseMove(e) {
    let ctx = this.ctx;
    let ctxOverlay = this.ctxOverlay;

    if (this.state.isDrawing) {
    
      
      if (this.props.activeItem === "Rectangle") {
        ctxOverlay.clearRect(0, 0, 600, 480);
        let width = e.clientX - this.state.offsetX - this.state.startX;
        let height = e.clientY - this.state.offsetY - this.state.startY;
        ctxOverlay.strokeRect(
          this.state.startX,
          this.state.startY,
          width,
          height
        );
      }
    }
   // console.log(this.state);
  }

  handleMouseUp(e) {
    let ctx = this.ctx;

   

    if (this.props.activeItem === "Rectangle") {
      let width = e.clientX - this.state.offsetX - this.state.startX;
      let height = e.clientY - this.state.offsetY - this.state.startY;
      this.ctxOverlay.clearRect(0, 0, 600, 480);
      ctx.strokeRect(this.state.startX, this.state.startY, width, height);
    }

    ctx.closePath();
    this.setState({ isDrawing: false });
    //console.log(this.state);
    // var data = ctx.toDataURL('image/png');
    // window.open(data);
  }

  saveHandler=()=>{
    this.setState({open:false});
    this.setState({save:true});
    this.setState({issaved:true});
    var canvas = document.querySelector( 'canvas' );
    var dataURL = canvas.toDataURL('image/png');
   
   // console.log(dataURL);
    if(!this.state.val=='')
    {
      let data={
        name:this.state.val,
        datas:dataURL.toString()
      }
  axios.post('https://react-my-burger-fb977.firebaseio.com/canvas.json',data)
  .then(res=>{
   // console.log(res);
   this.setState({save:false});
   this.setState({issaved:false});
   this.newclickHandler();
    
  }).catch(err=>{
  console.log('error');
  this.setState({issaved:false});
  });
    }
   
    
    
  }

newclickHandler=(e)=>{
  var canvas = document.querySelector( 'canvas' );
  const context = canvas.getContext('2d');

  context.clearRect(0, 0, canvas.width, canvas.height);

}

  LoadClickHndler=(id)=>{
    this.setState({save:false});
    this.setState({open:true});
    axios.get('https://react-my-burger-fb977.firebaseio.com/canvas.json')
    .then(res=>{
   
      let allfiles=[];
      for(let key in res.data){
        allfiles.push({
          ...res.data[key],
          id:key
        })
      }
     
      this.setState({contents:allfiles});
    // console.log(this.state.contents);
     
     //console.log(allfiles[1].datas);
  
  
  
    })
    .catch(err=>{
    console.log('error');
    });
  }
  typeIn=(e)=>{
    this.setState({val:e.target.value});
    console.log(this.state.val);
  }
  openClickHndler=(e)=>{
  this.newclickHandler();
   //console.log(e.target.value);
   let xer='';
   for(let i=0;i<this.state.contents.length;i++)
   {
if(this.state.contents[i].id==e.target.value)
xer=i;
   }
    var canvas = document.querySelector( 'canvas' );
    var ctx = canvas.getContext("2d");
    
    var image = new Image();
    image.onload = function() {
      ctx.drawImage(image, 0, 0);
    };
    
    image.src =this.state.contents[xer].datas; 
//console.log(this.state.contents[xer].datas);
    
  }



  render() {
  
    
   
    return (
      <Fragment>
     <div className="menu-bar">
         <button  className="menu-item"  name="New" onClick={this.newclickHandler} >New</button>
         <button  className="menu-item"  name="Save" onClick={this.saveHandler} >Save</button>
         <button  className="menu-item"  name="Load" onClick={this.LoadClickHndler} >Open</button>
      
      </div>
      <div>
        {this.state.save?<div>  <label>Enter a file name:</label>
        <input val={this.state.val} onChange={this.typeIn} type="text" required/></div> :null}
      

        {this.state.open?<div>
            <label>Select from the list which one to be loaded:</label>
            
        <select onClick={this.openClickHndler}>
         
          
          {
                 this.state.contents.map((obj) => {
                     return <option key={obj.id} value={obj.id}  >{obj.name}</option>
                 })
                }
        </select>
      </div>:null}
      </div>
      {this.state.issaved ? <div className="lds-hourglass"></div> :null}
      <div className="content">
       
       <div className="canvas">
         <canvas
           className="canvas-actual"
           width="600px"
           height="480px"
           ref={this.canvasRef}
           onMouseDown={this.handleMouseDown}
           onMouseMove={this.handleMouseMove}
           onMouseUp={this.handleMouseUp}
         />
         <canvas
           className="canvas-overlay"
           width="600px"
           height="480px"
           ref={this.canvasOverlayRef}
         />
        
       </div>
     </div>
      
      </Fragment>
    );
  }
}
