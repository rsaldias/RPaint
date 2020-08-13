// tool list
NONE          = -1;

// TOOLS
TOOLSELECT    = 0;
TOOLMOVE      = 2;
TOOLSCALE     = 3;
TOOLROTATE    = 4;
TOOLERASE     = 6;
TOOLSCALELINK = 7;

TOOLPENCIL    = 200;
TOOLRECTANGLE = 201;
TOOLPAINTING  = 202;

// ACTIONS
// ACTION_ADD_RECTANGLE  = 50;
// ACTION_ADD_PENCIL     = 51;
// ACTION_STORE_DATA     = 52;
// ACTION_PAINTING       = 53;
// ACTION_RESET_ALL      = 51;

// // MOUSE EVENT
// MOUSEDOWN = 100;
// MOUSEDRAG = 102;
// MOUSEUP   = 104;



function EventProperties(){
  this.click      = {down:{x:0, y:0}, up:{x:0, y:0}};
  this.deltaDrag  = {x:0, y:0};
  this.points     = [];
  this.tool       = NONE;

  // event
  this.action_saveOnMemory = false;
  this.action_transform    = false;
  this.action_add_rectangle= false;
  this.action_add_pencil   = false;
  this.action_show_erase   = false;
  this.action_hide_erase   = false;
  this.action_erasing      = false;
  this.action_unselectAll  = false;


  this.action_painting_begin     = false;
  this.action_painting_draw      = false;
  this.action_painting_end       = false;
  this.action_reset_delta_mouse  = false;
  this.action_selected           = false;


  // private
  this.mouseDown = false;
  this.mouseUp   = false;
  this.mouseDrag = false;


}
function Events(){
  // implement closure inheritance
  this.inheritsFrom = EventProperties;
  this.inheritsFrom();


  document.addEventListener("contextmenu", function(e){
    // clear default rigth click
      e.preventDefault();
  }, false);
  for (const ev of ["touchstart", "mousedown"]) {
    window.addEventListener(ev,  (e)=> {
      e.preventDefault();

      this.click.down.x = e.pageX;
      this.click.down.y = e.pageY;
      this.deltaDrag.x  = 0;
      this.deltaDrag.y  = 0;
      this.points.push({x:e.pageX ,y: e.pageY});

      this.mouseDown = true;
      this.action_saveOnMemory   = true;
      this.action_painting_begin = true;
      this.action_selected       = true;

      if(this.tool == NONE)this.action_unselectAll = true;
      if(this.tool == TOOLPENCIL)this.action_add_pencil = true;
      if(this.tool == TOOLERASE)this.action_show_erase = true;
      if(this.tool == TOOLRECTANGLE)this.action_add_rectangle= true;

    });
  };
  for (const ev of ['touchmove', 'mousemove']) {
    window.addEventListener(ev,  (e)=> {
      e.preventDefault();
      if(this.mouseDown){
        this.mouseDrag = true;
      };
      if(this.mouseDrag){
        // delta
        this.deltaDrag.x = this.click.down.x - e.pageX;
        this.deltaDrag.y = this.click.down.y - e.pageY;
        // this.points.push({x:e.pageX ,y: e.pageY});
        this.action_transform = true;
        this.action_painting_draw = true;
        this.action_erasing = true;

        const lastX = this.points[this.points.length-1].x;
        const lastY = this.points[this.points.length-1].y;
        if(e.pageX != lastX || e.pageY != lastY)
        this.points.push({x:e.pageX ,y: e.pageY});

      }

    });
  };
  for (const ev of ['touchend', 'touchleave', 'mouseup']) {
    window.addEventListener(ev,  (e)=> {
      e.preventDefault();

      this.click.up.x   = e.pageX;
      this.click.up.y   = e.pageY;
      this.mouseUp      = true;
      this.mouseDown    = false;
      this.mouseDrag    = false;


      this.action_painting_end  = true;
      if(this.tool == TOOLERASE)this.action_hide_erase = true;


      // if(this.tool == TOOLPENCIL && this.action == ACTION_ADD_PENCIL)this.action = ACTION_PAINTING;
    });
  };
  window.addEventListener("keydown", (e)=> {
    e.preventDefault();
    this.action_saveOnMemory = true;
    this.action_reset_delta_mouse = true;
    switch (e.code){
      // https://keycode.info/
      // case 'Space': this.event = FLOATMENU;break;
      case 'Digit1':  this.tool = TOOLPENCIL;
                      document.body.style.cursor = 'crosshair';
                      break;
      case 'Digit2':  this.tool = TOOLERASE;
                      document.body.style.cursor = "url('./img/MouseErase.png') 16 16, auto";
                      break;
      case 'Digit3':  this.tool = TOOLRECTANGLE;
                      document.body.style.cursor = "url('./img/MouseAddRectangle.png') 16 16, auto";
                      break;

    };
    if(e.shiftKey){
      // Shift =>
      this.tool  = TOOLSELECT;
      document.body.style.cursor = "url('./img/MouseSelector.png') 16 16, auto";
    }
    if(e.altKey){
      // Alt =>
      this.tool  = TOOLSCALE;
      document.body.style.cursor = "url('./img/MouseResize.png') 16 16, auto";
    }
    if(e.ctrlKey){
      // Crtl =>
      this.tool  = TOOLMOVE;
      document.body.style.cursor = "url('./img/MouseMove.png') 16 16, auto";
      switch (e.key){
        case '1' : this.tool  = NONE;document.body.style.cursor = 'default';break;
        case '2' : this.tool  = NONE;document.body.style.cursor = 'default';break;
        case '3' : this.tool  = NONE;document.body.style.cursor = 'default';break;
      }
    }
    if(e.metaKey){
      // CMD =>
      this.tool  = TOOLROTATE;
      document.body.style.cursor = "url('./img/MouseRotate.png') 16 16, auto";
      switch (e.key){
        case '1' : this.tool  = NONE;document.body.style.cursor = 'default';break;
        case '2' : this.tool  = NONE;document.body.style.cursor = 'default';break;
        case '3' : this.tool  = NONE;document.body.style.cursor = 'default';break;
      }
    }
    if(e.metaKey && e.altKey){
      // CMD + ALT =>
      this.tool   = TOOLSCALELINK;
      document.body.style.cursor = "url('./img/MouseResize.png') 16 16, auto";
    }
    if(e.metaKey && e.ctrlKey){
      // CMD +   CTRL =>
    }
    console.log('this.tool: ' + this.tool )
  }); // end keydown
  window.addEventListener("keyup", (e)=>{
    e.preventDefault();
    // console.log('e.key: ' + e.key)
    switch (e.key){
      case 'Shift'    : this.tool = NONE;document.body.style.cursor = 'default';break;
      case 'Alt'      : this.tool = NONE;document.body.style.cursor = 'default';break;
      case 'Control'  : this.tool = NONE;document.body.style.cursor = 'default';break;
      case 'Meta'     : this.tool = NONE;document.body.style.cursor = 'default';break;
    }
    console.log('this.tool: ' + this.tool)
  }); // end keyup

  // FUNCTIONS
  this.resetMouse         = ResetMouse(this);
  this.resetAction        = ResetAction (this);
  this.resetTool          = ResetTool(this);

} // end Events

// function ResetMouseEvents(events){
//   return ()=>{
//     events.mouseEvent = NONE;
//   }
// }

function ResetAction(events){
  return ()=>{
    // console.log('ResetAction...')
    events.action_saveOnMemory = false;
    events.action_transform    = false;
    events.action_add_rectangle= false;
    events.action_add_pencil   = false;
    events.action_show_erase   = false;
    events.action_hide_erase   = false;
    events.action_erasing      = false;
    events.action_unselectAll  = false;

    events.action_painting_begin     = false;
    events.action_painting_draw      = false;
    events.action_painting_end       = false;
    events.action_reset_delta_mouse  = false;
    events.action_selected           = false;
  }
}

function ResetTool(events){
  return ()=>{
    events.tool  = NONE;
  }
}

function ResetMouse(events){
  return ()=>{
    events.click      = {down:{x:0, y:0}, up:{x:0, y:0}};
    events.deltaDrag  = {x:0, y:0};
    events.points     = [];
  }
}
