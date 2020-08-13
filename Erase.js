function Erase (){
  // implement closure inheritance
  this.inheritsFrom = Shape;
  this.inheritsFrom('Erase');

  // CONSTRUCTOR
  // this.create = PencilConstructor(this);
  // DRAW
  this.draw   = EraseDraw(this);

  // CUSTOM VAR
  this.status = 'none';
  this.radio  = 30;
}

function EraseDraw(erase){
  return (ctx, w, h)=>{

    if(erase.points.length == 0){
      return;
    };

    // CLEAR CANVAS
    ctx.clearRect(0, 0, w, h);

    if(erase.hide)return;

    ctx.beginPath();
    ctx.arc(erase.points[erase.points.length-1].x, erase.points[erase.points.length-1].y, erase.radio, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();


  }
}
