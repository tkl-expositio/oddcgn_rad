backgroundoffsetx = 0;

function start_himmel(){
  console.log("start_himmel");
  window.setInterval(function(){push_himmel()}, 50);
}

function push_himmel(){
  backgroundoffsetx++;
  var csscode = backgroundoffsetx/1 + "px 0px";
  // console.log(csscode);
  document.body.style.backgroundPosition = csscode;
}

