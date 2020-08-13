function ShapeProperties (type){
  this.type      = type;

  this.rotation  = 0;
  this.center    = {x:0, y:0};
  this.pivot     = {x:0, y:0};
  this.size      = {w:1, h:1};
  this.scale     = {w:1, h:1};

  this.k         = {w:1, h:1};
  // this.erase     = false;
  this.points         = [];
  this.pointsErase    = [];
  this.buffer         = [];
  this.bufferErase    = [];

  this.selected  = true;
  this.hide      = false;

}

function Shape (type){
  // implement closure inheritance
  this.inheritsFrom = ShapeProperties;
  this.inheritsFrom(type);

  this.mem = new ShapeProperties();

  this.addPoints        = AddPoints(this);
  this.setRotation      = SetRotationShape(this);
  this.setCenter        = SetCenterShape(this);
  this.setPivot         = SetPivotShape(this);
  this.setSize          = SetSizeShape(this);
  this.setScale         = SetScaleShape(this);
  this.setPivotOnCenter = SetPivotOnCenterShape(this);

  this.getCenterAndSize = GetCenterAndSizeShape(this);
  this.transform        = Transform(this);
  this.save             = Save(this);

}

function Save(shape){
  return ()=>{
    shape.mem.rotation  = shape.rotation;
    shape.mem.center    = shape.center;
    shape.mem.pivot     = shape.pivot;
    shape.mem.size      = shape.size;
    shape.mem.scale     = shape.scale;
  }
}



function AddPoints(shape){
  return (points)=>{
    if(points.length>0)shape.points = Array.from(points);
  }
}

function SetRotationShape(shape){
  return (rotation)=>{
    shape.rotation = rotation;
  }
}

function SetCenterShape(shape){
  return (center)=>{
    shape.center = center;
  }
}

function SetPivotShape(shape){
  return (pivot)=>{
    shape.pivot = pivot;
  }
}

function SetSizeShape(shape){
  return (size)=>{
    shape.scale = { w: size.w/shape.k.w, h: size.h/shape.k.h };
    shape.size  = { w: size.w, h: size.h };
  }
}

function SetScaleShape(shape){
  return (scale)=>{
    shape.scale = scale;
    shape.size = { w: shape.scale.w * shape.k.w, h: shape.scale.h * shape.k.h };
    // console.log(shape.size)
  }
}

function SetPivotOnCenterShape(shape){
  return ()=>{
    shape.pivot = shape.center;
  }
}

function GetCenterAndSizeShape(shape){
  return ()=>{
    // calculate separate arrays
    const resultX = [].map.call(shape.points, function(obj) {
      return obj.x;
    });
    const resultY = [].map.call(shape.points, function(obj) {
      return obj.y;
    });
    const maxX = Math.max.apply(null, resultX);
    const minX = Math.min.apply(null, resultX);
    const maxY = Math.max.apply(null, resultY);
    const minY = Math.min.apply(null, resultY);

    const w = maxX - minX;
    const h = maxY - minY;
    const x = minX + w/2;
    const y = minY + h/2;

    const size  = {w, h};
    const center = {x, y};

    return {center, size};
  }
}

function Transform(shape){
  return (scaleX, scaleY, skewX, skewY, tx, ty)=>{
    // Equations:
    // newx = scaleX * x + skewX  * y + tx;
    // newy = skewY  * x + scaleY * y + ty;
    // scaleX = cos(angle)
    // skewY = -sin(angle)
    // skewX = sin(angle)
    // scaleY = cos(angle)

    for(let i=0; i<shape.points.length; i++){
        let xp = scaleX * shape.points[i].x + skewX  * shape.points[i].y + tx;
        let yp = skewY  * shape.points[i].x + scaleY * shape.points[i].y + ty;
        shape.points[i] = {x: xp, y: yp};
    };
    for(let i=0; i<shape.pointsErase.length; i++){
        let xp = scaleX * shape.pointsErase[i].x + skewX  * shape.pointsErase[i].y + tx;
        let yp = skewY  * shape.pointsErase[i].x + scaleY * shape.pointsErase[i].y + ty;
        shape.pointsErase[i] = {x: xp, y: yp};
    };
  }
}
