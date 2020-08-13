function Pencil (){
  // implement closure inheritance
  this.inheritsFrom = Shape;
  this.inheritsFrom('Pencil');

  // CONSTRUCTOR
  // this.create = PencilConstructor(this);
  // DRAW
  this.draw   = PencilDraw(this);

  // CUSTOM VAR
  this.status      = 'none';
  this.statusErase = 'none';
  this.radio  = 30;
  this.origin = {x:0, y:0};
}

function PencilDraw(pencil){
  return (ctx, w, h)=>{

    let xc = 0;
    let yc = 0;


    if(pencil.status == 'redraw' && pencil.buffer.length > 0){
      // console.log('redraw...')

      pencil.points      = Array.from(pencil.buffer);
      pencil.pointsErase = Array.from(pencil.bufferErase);

      pencil.transform(1,1,0,0,-pencil.origin.x, -pencil.origin.y);
      pencil.transform(1,1,0,0,pencil.center.x, pencil.center.y);

      // redraw
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath();
      ctx.moveTo(pencil.points[0].x, pencil.points[0].y);
      for(let n = 1; n < pencil.points.length-1; n++ ){
        xc = (pencil.points[n].x + pencil.points[n + 1].x) / 2;
        yc = (pencil.points[n].y + pencil.points[n + 1].y) / 2;
        ctx.quadraticCurveTo(pencil.points[n].x, pencil.points[n].y, xc, yc);
      };
      ctx.moveTo(xc, yc);
      ctx.stroke();

      // delete
      for(let n = 1; n < pencil.pointsErase.length; n++ ){
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(pencil.pointsErase[n].x, pencil.pointsErase[n].y, pencil.radio, 0, 2 * Math.PI);
        ctx.fill();
      }

      // // deco
      // ctx.globalCompositeOperation = 'source-over';
      // ctx.beginPath();
      // ctx.arc(pencil.center.x, pencil.center.y, 6, 0, 2 * Math.PI);
      // ctx.fill();
      // const x = pencil.center.x - pencil.size.w/2;
      // const y = pencil.center.y - pencil.size.h/2;
      // ctx.lineWidth = 1;
      // ctx.strokeStyle = 'rgb(125, 193, 63)';
      // ctx.beginPath();
      // ctx.strokeRect(x, y, pencil.size.w, pencil.size.h);
      // ctx.fill();



    }

    if(pencil.points.length == 0){
      return;
    };



    if(pencil.status == 'begin' && pencil.points.length > 0){
      ctx.moveTo(pencil.points[0].x, pencil.points[0].y);
      pencil.status = 'draw';
      ctx.beginPath();
    }

    const lenpoints = 4;
    if(pencil.points.length == 1 && pencil.status == 'draw'){
      ctx.moveTo(pencil.points[0].x, pencil.points[0].y);
      ctx.lineTo(pencil.points[0].x + 0.5 , pencil.points[0].y);
      ctx.stroke();
      ctx.beginPath();
    }
    if(pencil.points.length > lenpoints && pencil.status == 'draw'){
      const i  = pencil.points.length - (lenpoints + 1);
      for(let n = i; n < pencil.points.length-1; n++ ){
        xc = (pencil.points[n].x + pencil.points[n + 1].x) / 2;
        yc = (pencil.points[n].y + pencil.points[n + 1].y) / 2;
        ctx.quadraticCurveTo(pencil.points[n].x, pencil.points[n].y, xc, yc);
      };
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(xc, yc);
    }
    if(pencil.status == 'end'){
      ctx.beginPath();
      console.log('end ...')
      const data = pencil.getCenterAndSize();
      pencil.origin = data.center;
      pencil.center = data.center;
      pencil.pivot  = data.center;
      pencil.size   = data.size;
      pencil.buffer = Array.from(pencil.points);
      pencil.status = 'redraw';
    }
    if(pencil.status == 'begin_erase' && pencil.points.length > 0){
      // delete on pause
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pencil.points[pencil.points.length-1].x, pencil.points[pencil.points.length-1].y, pencil.radio, 0, 2 * Math.PI);
      ctx.fill();
      // store pixel delete
      const x = pencil.points[pencil.points.length-1].x - (pencil.center.x - pencil.origin.x);
      const y = pencil.points[pencil.points.length-1].y - (pencil.center.y - pencil.origin.y);
      pencil.bufferErase.push({x:x ,y:y});

    }
    if(pencil.status == 'end_erase' && pencil.points.length > 0){
      pencil.status = 'none';
      ctx.globalCompositeOperation = 'source-over';
    }


  }
}
