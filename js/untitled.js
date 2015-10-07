

topInput=document.getElementById("top");
leftInput=document.getElementById("left");

topInput.onchange = function() {

  // setAttribute("style", "top: 300px;");
  document.getElementById("box").style.top = topInput+"px";
   console.log(topInput.value);
  getCoordinate();
};
leftInput.onchange = function() {
  document.getElementById("box").style.left = leftInput+"px";
  getCoordinate();
};



function getCoordinate() {

  resizeForm = document.getElementById('image');

  var formHeight = resizeForm.clientHeight;
  var formWidth = resizeForm.clientWidth;

  xyBox = document.getElementById('box');

  var x = findPosX(xyBox);
  var y = findPosY(xyBox);

  function findPosX(obj) {

    var curleft = 0;

    if (obj.offsetParent) {

      while (1) {

        curleft += obj.offsetLeft;

        if (!obj.offsetParent) {
          break;
        }
        obj = obj.offsetParent;
      }
    } else if (obj.x) {
      curleft += obj.x;
    }
    return curleft;
  }

  function findPosY(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
      while (1) {
        curtop += obj.offsetTop;
        if (!obj.offsetParent) {
          break;
        }
        obj = obj.offsetParent;
      }
    } else if (obj.y) {
      curtop += obj.y;
    }
    return curtop;
  }


  //находим координаты точек
  var A = [x, y];
  var B = [x, y];
  var C = [x, y];
  var D = [x, y];

  A[x] = x;
  A[y] = formHeight - (y + 100);

  B[x] = x;
  B[y] = formHeight - y;

  C[x] = x + 100;
  C[y] = formHeight - y;

  D[x] = x + 100;
  D[y] = formHeight - (y + 100);


  console.log("A:" + A[x], A[y], "B:" + B[x], B[y], "C:" + C[x], C[y], "D:" + D[x], D[y]);
}
