'use strict';
/* global
  resizer: true

*/

define(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];
  var squareSize = document.getElementById('resize-size');
  var leftSize = document.getElementById('resize-x');
  var topSize = document.getElementById('resize-y');
  var previewImage = document.querySelector('.resize-image-preview');


  var prevButton = resizeForm['resize-prev'];
  /**
   * Обработчик кликов по элементу.
   * @param {MouseEvent} evt
   */
  prevButton.onclick = function(evt) {
    evt.preventDefault();

    resizeForm.reset();
    uploadForm.reset();
    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

 /**
   * Обработчик события отправки формы
   *  @param {Event} evt
   */
  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();
     filterForm.elements['filter-image-src'].src = resizer.exportImage().src;
    document.querySelector('.filter-image-preview').src = resizer.exportImage().src;


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


  //находим максимальное значение стороны квадрата

    squareSize.max = Math.min(imgWidth, imgHeight);
    leftSize.max = imgWidth - squareSize.max;
    topSize.max = imgHeight - squareSize.max;
    squareSize.value = Math.floor(squareSize.max * 0.75);
  });

  //находим максимальное значение отступа, если есть отступ слева
  leftSize.addEventListener('change', function() {
    if (!squareSize.value) {
      this.max = squareSize.max - squareSize.min;
    } else {
      this.max = imgWidth - parseInt(squareSize.value, 10);
    }
  });

  //находим максимальное значение отступа, если есть отступ сверху
  topSize.addEventListener('change', function() {
    if (!squareSize.value) {
      this.max = squareSize.max - squareSize.min;
    } else {
      this.max = imgHeight - parseInt(squareSize.value, 10);
    }
  });

  //пересчитваем поля отступов, если ввели вручную размер и хотим с ним жить
  squareSize.addEventListener('change', function() {
    if (squareSize.max > 1) {
      topSize.max = (imgHeight - parseInt(squareSize.value, 10));
      leftSize.max = (imgWidth - parseInt(squareSize.value, 10));
    }
  });

  squareSize.addEventListener('change', function() {
    if (squareSize.value) {
      resizer.setConstraint(
        resizer.getConstraint().x - ((parseInt(squareSize.value, 10) - resizer.getConstraint().side) / 2),
        resizer.getConstraint().y - ((parseInt(squareSize.value, 10) - resizer.getConstraint().side) / 2),
        parseInt(squareSize.value, 10));
    } else {
      squareSize.value = 0;
    }
  });


  window.addEventListener('resizerchange', function() {
    var constraint = resizer.getConstraint();
    var x = constraint.x > 0 ? undefined : 0;
    var y = constraint.y > 0 ? undefined : 0;
    var side = squareSize.max > constraint.side ? constraint.side : squareSize.max;

    if ((typeof x === 'undefined') && (imgWidth - constraint.x < constraint.side)) {
      x = imgWidth - constraint.side;
    }

    if ((typeof y === 'undefined') && (imgHeight - constraint.y < constraint.side)) {
      y = imgHeight - constraint.side;
    }

    if ((typeof x !== 'undefined') || (typeof y !== 'undefined')) {
      constraint.side = side;
      resizer.setConstraint(x, y, constraint.side);
    }

    if ((typeof x !== 'undefined') || (typeof y !== 'undefined') && (squareSize.max < parseInt(squareSize.value, 10))) {
      constraint.side = Math.min(parseInt(squareSize.value, 10), squareSize.max);
    }

  });


});
