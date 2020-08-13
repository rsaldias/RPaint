

let events = new Events();
let layerList = [];


window.addEventListener('load', function(){

  let layer = new LayerShape('wrapper', 'Erase', layerList.length);
  layer.shape.hide = true;
  layer.fillStyle = 'rgba(126, 126, 126, 1)';
  layer.lineWidth = 2;
  layer.strokeStyle = 'rgba(84, 84, 84, 1)';
  layerList.push(layer);

  setInterval(mainDraw, 25);

});

function mainDraw(){

  // console.log('mainDraw ...')

  if(events.action_add_pencil){
    console.log('action_add_pencil . . .')
    let layer = new LayerShape('wrapper', 'Pencil', layerList.length);
    layerList.push(layer);
    // events.points = [];
    events.tool = TOOLPAINTING;
    events.action_painting_begin = true;
  }

  for(let i = 0; i<layerList.length; i++){

    // add points  - - - - - - - - - - - - - - -
    layerList[i].addPointsToShape(events.points);
    if(events.action_saveOnMemory){
      // console.log('action_saveOnMemory ...')
      layerList[i].shape.save();
      events.deltaDrag = {x:0, y:0};
    };


    if(events.tool == TOOLPAINTING && layerList[i].type == 'Pencil' && layerList[i].shape.selected){
      layerList[i].redraw = true;
      if(events.action_painting_begin){
        layerList[i].shape.status = 'begin';
        document.body.style.cursor = 'crosshair';
      };
      if(events.action_painting_draw){
        layerList[i].shape.status = 'draw';
      };
      if(events.action_painting_end){
        layerList[i].shape.status  = 'end';
        events.points = [];
        layerList[i].shape.selected = false;
        events.tool = TOOLPENCIL;
      };
    };// if TOOLPAINTING
    if(events.tool == TOOLERASE && layerList[i].type == 'Pencil'){
      // Clear pencil layer
      layerList[i].redraw = true;
      if(events.action_painting_begin){
        layerList[i].shape.status = 'begin_erase';
      };
      if(events.action_painting_end){
        layerList[i].shape.status  = 'end_erase';
        events.points = [];
      };
    };
    if(events.tool == TOOLERASE && layerList[i].type == 'Erase'){
      // Draw erase tool
      layerList[i].redraw = true;
      if(events.action_painting_begin){
        layerList[i].shape.hide = false;
        document.body.style.cursor = 'crosshair';
      };
      if(events.action_painting_end){
        layerList[i].shape.hide = true;
        document.body.style.cursor = "url('./img/MouseErase.png') 16 16, auto";
        events.points = [];
      };
    };
    // move
    if(events.tool == TOOLMOVE && layerList[i].type == 'Pencil'){ // && layerList[i].shape.selected
      layerList[i].redraw = true;
      layerList[i].shape.status = 'redraw';
      // console.log('TOOLMOVE: ' + layerList[i].shape.mem.center.x + ', ' + layerList[i].shape.mem.center.y)
      // layerList[i].shape.setCenter({x: 200,
      //                               y: 200});
      layerList[i].shape.setCenter({x: layerList[i].shape.mem.center.x - events.deltaDrag.x,
                                    y: layerList[i].shape.mem.center.y - events.deltaDrag.y});

    }


    // draw - - - - - - - - - - - - - - -
    layerList[i].draw();





  }

  // Reset all events
  events.resetAction();
}
