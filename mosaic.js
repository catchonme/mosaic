(function (window, document) {
  // 马赛克大小， 鼠标是否按下
  var mosaicSize = 30,mousedown = false;
  var timer = null;
  var canvas = document.createElement("canvas");
  var canvasContext = canvas.getContext("2d");
  canvas.style.display = "none";
  document.body.appendChild(canvas);

  var img = document.querySelector("#mosaic-image");
  var rect = img.getBoundingClientRect();
  var imageProp = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top,
    scrollLeft: document.documentElement.scrollLeft,
    scrollTop: document.documentElement.scrollTop
  }

  img.addEventListener("mousedown", function (event) {
    if (event.target.tagName === "IMG") {
      mousedown = true;
      canvas.width = imageProp.width;
      canvas.height = imageProp.height;
      canvas.style.position = "absolute";
      canvas.style.display = "block";
      canvas.style.top = imageProp.top + imageProp.scrollTop + "px";
      canvas.style.left = imageProp.left + imageProp.scrollLeft + "px";
      canvasContext.drawImage(img, 0, 0, imageProp.width, imageProp.height);
      img.style.visibility = "hidden";
    }
  }, false);

  // 该函数是当首次以后，鼠标再次按下，这时候就是在canvas下的mousedown
  canvas.addEventListener("mousedown", function () {
    mousedown = true;
  })

  canvas.addEventListener("mousemove", function (event) {
    // 判断是否mousedown是为了防止鼠标抬起后，mousemove还会继续马赛克
    if (mousedown) {
      if (timer) {
        clearTimeout(timer);
        timer = setTimeout(function () {
          drawMosaic(event);
        }, 16);
      } else {
        timer = setTimeout(function () {
          drawMosaic(event);
        }, 16);
      }
    }
  }, false)

  function drawMosaic(event) {
    var mousePageX = event.pageX;
    var mousePageY = event.pageY;

    var canvasX = mousePageX - imageProp.left - imageProp.scrollLeft;
    var canvasY = mousePageY - imageProp.top - imageProp.scrollTop;
    // 获取到鼠标当前的像素，然后扩大该像素，营造出马赛克
    var imgData = canvasContext.getImageData(canvasX, canvasY, 1, 1).data;
    canvasContext.fillStyle = "rgba(" + imgData[0] + "," + imgData[1] + "," + imgData[2] + "," + imgData[3] + ")";
    canvasContext.fillRect(canvasX - (mosaicSize / 2), canvasY - (mosaicSize / 2), mosaicSize, mosaicSize);
  }
  
  canvas.addEventListener("mouseup", function () {
    mousedown = false;
    var tempImageData = canvas.toDataURL("image/png");
    img.src = tempImageData;
    img.style.visibility = "visible";
    canvas.style.display = "none";
  }, false)

})(window, document)