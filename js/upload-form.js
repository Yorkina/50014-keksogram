'use strict';
/* global
  resizer: true
*/
define([
  'resize-picture'
], function(Resizer) {
  /**
   * @type {Element}
   */
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var fileElement = uploadForm['upload-file'];

 /**
   * @param {Element}
   * @callback
   */
  function uploadImage(element, callback) {
    var fileReader = new FileReader();
    fileReader.onload = function(evt) {

      var image = evt.target.result;
      callback(image);
    };

    fileReader.readAsDataURL(element.files[0]);
  }
 /** Обработчик события изменения в форме загрузки,
   * считывает наличие загруженной картинки
   */
  fileElement.onchange = function() {
    if (fileElement.value) {
      fileElement.classList.add('upload-input-hasvalue');
    }
  };
  /** Обработчик события загрузки картинки
   *  @param {Event} evt
   */
  uploadForm.onsubmit = function(evt) {
    evt.preventDefault();

    uploadImage(fileElement, function(image) {
      sessionStorage.setItem('uploaded-image', image);
      resizeForm.querySelector('.resize-image-preview').src = image;
      filterForm.querySelector('.filter-image-preview').src = image;

      resizer = new Resizer(image);
      resizer.setElement(resizeForm);

      uploadForm.classList.add('invisible');
      resizeForm.classList.remove('invisible');
    });
  };

  uploadForm.onreset = function() {
    fileElement.classList.remove('upload-input-hasvalue');
  };
});
