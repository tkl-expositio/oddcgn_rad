counter = 0;

function start_himmel(){
  window.setInterval(function(){push_himmel()}, 50);

  var outerwrapper = document.getElementById('outerwrapper');
  outerwrapper.style.height = window.innerHeight + "px";

  
}

function push_himmel(){
  counter++;

  var csscode1 = -counter/1 + "px 0px";
  document.getElementById('outerwrapper').style.backgroundPosition = csscode1;

  var csscode2 = -counter/2 + "px 0px";
  document.body.style.backgroundPosition = csscode2;
}

