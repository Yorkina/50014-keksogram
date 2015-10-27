(function() {
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];


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
  resizeSize.addEventListener('change', function() {
    resizer.setConstraint(resizer.getConstraint().x,resizer.getConstraint().y,resizeSize.value);
  });
})();
