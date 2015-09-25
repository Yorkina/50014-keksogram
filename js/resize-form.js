(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var previewImage = resizeForm.querySelector('.resize-image-preview');
  var prevButton = resizeForm['resize-prev'];

  prevButton.onclick = function(evt) {
    evt.preventDefault();

    resizeForm.reset();
    uploadForm.reset();
    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();
    filterForm.elements['filter-image-src'] = previewImage.src;

    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };
})();





  //код мой

  var squareSize = document.getElementById('resize-size');
  var leftSize = document.getElementById('resize-x');
  var topSize = document.getElementById('resize-y');
  var previewImage = document.querySelector('.resize-image-preview')

  var imgHeight = 0;
  var imgWidth = 0;

  //считываем факт загрузки картинки
  previewImage.addEventListener('load', function(evt) {
    evt.preventDefault();

  //получаем размеры каринки после загрузки
    imgHeight = this.clientHeight;
    imgWidth = this.clientWidth;
    console.log(imgWidth + " и " + imgHeight);
  });

  //трем ввод отрицательных значений
  //  squareSize.addEventListener ('change', function(evt) {
  //  evt.preventDefault();
  //  if (this.value >= 1) {
  //    cropSize = this.value;
  //  } else {
  //    this.value ="";
  //  });

  //находим минимальное значение стороны квадрата
  var getMaxSide = function() {
    if (imgHeight >= imgWidth) {
      squareSize.max = (imgWidth - leftSize.value);
    } else {
      squareSize.max = (imgHeight - topSize.value);
    }
    console.log (squareSize.max);
  };

  //находим минимальное значение стороны если есть отступ слева
  leftSize.addEventListener ('change', function(evt) {
    evt.preventDefault();
    getMaxSide();
    if (leftSize > squareSize.max ){
      leftSize.max = (imgWidth - squareSize.max);
    } else {
      leftSize.max = 0;
    }
    console.log (squareSize.max);
  });

  //находим минимальное значение стороны если есть отступ сверху
  topSize.addEventListener ('change', function(evt) {
    evt.preventDefault();
    getMaxSide();
    if (topSize > squareSize.max ){
      topSize.max = (imgHeight - squareSize.max);
    } else {
      topSize.max = 0;
    }
    console.log (squareSize.max);
  });

  //пересчитваем поля отступов, если ввели вручную размер и хотим с ним жить
  squareSize.addEventListener ('change', function(evt) {
    evt.preventDefault();
    if (squareSize.max > 0){
      topSize.max = (imgHeight - squareSize.value);
      leftSize.max = (imgWidth - squareSize.value);
    } 
    console.log (squareSize.max);
  });





