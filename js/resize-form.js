'use strict';
/* global
  resizer: true
*/

(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];
  var squareSize = document.getElementById('resize-size');
  var leftSize = document.getElementById('resize-x');
  var topSize = document.getElementById('resize-y');
  var previewImage = document.querySelector('.resize-image-preview');


  var resizeSize = resizeForm['size'];
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
    if (filterForm.querySelector('.filter-image-preview').src === '') {
      filterForm.querySelector('.filter-image-preview').src = resizer.exportImage().src;
    }

    resizeForm.classList.add('invisible');
    filterForm.classList.remove('invisible');
  };

  var imgHeight = 0,
    imgWidth = 0;

  //считываем факт загрузки картинки
  previewImage.addEventListener('load', function() {

  //получаем размеры каринки после загрузки
    imgWidth = this.naturalWidth;
    imgHeight = this.naturalHeight;
    console.log(imgWidth, imgHeight);



  //находим максимальное значение стороны квадрата

    squareSize.max = Math.min(imgWidth, imgHeight);
    leftSize.max = imgWidth - squareSize.max;
    topSize.max = imgHeight - squareSize.max;
  });

  //находим максимальное значение отступа, если есть отступ слева
  leftSize.addEventListener('change', function() {
    if (!squareSize.value) {
      this.max = squareSize.max - squareSize.min;
    } else {
      this.max = imgWidth - squareSize.value;
    }
  });

  //находим максимальное значение отступа, если есть отступ сверху
  topSize.addEventListener('change', function() {
    if (!squareSize.value) {
      this.max = squareSize.max - squareSize.min;
    } else {
      this.max = imgHeight - squareSize.value;
    }
  });

  //пересчитваем поля отступов, если ввели вручную размер и хотим с ним жить
  squareSize.addEventListener('change', function() {
    if (squareSize.max > 1) {
      topSize.max = (imgHeight - squareSize.value);
      leftSize.max = (imgWidth - squareSize.value);
    }
  });

  resizeSize.addEventListener('change', function() {
    resizer.setConstraint(
      resizer.getConstraint().x - ((resizeSize.value - resizer.getConstraint().side) / 2),
      resizer.getConstraint().y - ((resizeSize.value - resizer.getConstraint().side) / 2),
      parseInt(resizeSize.value, 10));
  });

  window.addEventListener('pictureload', function() {
    resizeSize.value = resizer.getConstraint().side;
  });

  window.addEventListener('resizerchange', function() {
    var constraint = resizer.getConstraint();
    var x = 0 > constraint.x ? 0 : 'undefined';
    var y = 0 > constraint.y ? 0 : 'undefined';
    if (x === 'undefined' && imgWidth - constraint.x < constraint.side) {
      x = imgWidth - constraint.x;
    }
    if (y === 'undefined' && imgHeight - constraint.y < constraint.side) {
      y = imgHeight - constraint.y;
    }
  });

})();
