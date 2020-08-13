function LayerProperties (type){
  this.type           = type;
  this.uuid           = UUID();
  this.zIndex         = 0;
  this.redraw         = true;
  this.canvas         = null;
  this.ctx            = null;
  this.w              = 0;
  this.h              = 0;
  this.shape          = null;

  // Style ctx
  this.textAlign      = 'center';
  this.font           = '14px Verdana';
  this.fillStyle      = 'rgba(195, 105, 0, 0.83)';
  this.strokeStyle    = 'rgba(12, 12, 12, 1)';
  this.lineWidth      = 0;
  this.lineJoin       = 'round';
  this.lineCap        = 'round';
  this.dash           = []; /* [dashes are px , spaces are px ]*/
  this.shadowBlur     = 0;
  this.shadowColor    = 'rgba(210, 210, 210, 0.5)';
  this.shadowOffsetX  = 0;
  this.shadowOffsetX  = 0;
}


function LayerShape (idWrapper, type, zIndex){
  // implement closure inheritance
  this.inheritsFrom = LayerProperties;
  this.inheritsFrom(type);

  // Create new canvas to draw
  var newCanvas = document.createElement('canvas');
  newCanvas.id = this.uuid;

  // append new canvas to document
  var wrapper = document.getElementById(idWrapper);
  if(wrapper!=null){
    wrapper.appendChild(newCanvas);
  }

  // Set size root canvas
  this.canvas     = document.getElementById(this.uuid);
  if(this.canvas==null){
    console.log('ERROR ON compose: ' + this.uuid + ' is not on DOM');
  }else{
    this.ctx           = this.canvas.getContext('2d');
    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.w             = this.canvas.width;
    this.h             = this.canvas.height;

    //get DPI
    let dpi = window.devicePixelRatio
    let style_height = +getComputedStyle(this.canvas).getPropertyValue('height').slice(0, -2);
    let style_width = +getComputedStyle(this.canvas).getPropertyValue('width').slice(0, -2);
    this.canvas.setAttribute('height', style_height * dpi);
    this.canvas.setAttribute('width', style_width * dpi);
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    // css style
    this.canvas.style.zIndex = zIndex;
    this.canvas.style.display = 'block'; // none, block

    // add Shape to layer
    if(this.type == 'Erase'){
      this.shape =  new Erase();
    };
    if(this.type == 'Pencil'){
      this.shape =  new Pencil();
      this.lineWidth = 4.5;
    };
  }

  // FUNCTIONS
  this.addPointsToShape   = AddPointsToShape(this);
  this.draw               = DrawLayer(this);
  this.loadStyle          = LoadStyle(this);
  // this.saveOnMemory       = SaveOnMemory(this);
  // this.clickOver          = ClickOver(this);
  // this.setSelected        = SetSelected(this);
  // this.selectedToggle     = SelectedToggle(this);
  // this.setHide            = SetHide(this);

  this.move = MoveLayer(this);

} // end LayerShape

function MoveLayer(layershape){
  return () =>{
    console.log('MoveLayer')
    layershape.ctx.scale(2,2);
  }
}

function AddPointsToShape(layershape){
  return (points) =>{
    // layershape.hide ||
    if(layershape.shape==null)return;

    // add points
    layershape.shape.addPoints(points);
  }
}

function DrawLayer(layershape){
  return () =>{
    // layershape.hide ||
    if(!layershape.redraw || layershape.shape==null)return;

    // set style shape
    layershape.loadStyle();
    // draw Shape of Layer
    layershape.shape.draw(layershape.ctx, layershape.w, layershape.h);

    // reset redraw
    layershape.redraw = false;
  }
}

function LoadStyle(layershape){
  return () =>{
    if(layershape.ctx == null)return;
    layershape.ctx.textAlign      = layershape.textAlign;
    layershape.ctx.font           = layershape.font;
    layershape.ctx.fillStyle      = layershape.fillStyle;
    layershape.ctx.strokeStyle    = layershape.strokeStyle;
    layershape.ctx.lineWidth      = layershape.lineWidth;
    layershape.ctx.lineJoin       = layershape.lineJoin;
    layershape.ctx.lineCap        = layershape.lineCap;
    layershape.ctx.setLineDash(layershape.dash);
    layershape.ctx.shadowBlur     = layershape.shadowBlur;
    layershape.ctx.shadowColor    = layershape.shadowColor;
    layershape.ctx.shadowOffsetX  = layershape.shadowOffsetX;
    layershape.ctx.shadowOffsetX  = layershape.shadowOffsetX;
    if(layershape.lineWidth==0)layershape.ctx.strokeStyle = 'rgba(0, 0, 0, 0)';
  }
}


// TOOLS FUNCTIONS

function UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}
