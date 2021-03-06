'use strict';

(function() {
  /**
   * @type {Element}
   */
  var uploadForm = document.forms['upload-select-image'];
  var resizeForm = document.forms['upload-resize'];
  var filterForm = document.forms['upload-filter'];

  var previewImage = filterForm.querySelector('.filter-image-preview');
  var prevButton = filterForm['filter-prev'];
  var selectedFilter = filterForm['upload-filter'];

  var filterMap;
  /**
   * Устанавливает текущий фильтр на загруженную картинку
   */
  function setFilter() {
    if (!filterMap) {
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }

    previewImage.className = 'filter-image-preview' + ' ' + filterMap[selectedFilter.value];
  }

  for (var i = 0, l = selectedFilter.length; i < l; i++) {
    selectedFilter[i].onchange = function() {
      setFilter();
    };
  }
   /**
   * Обработчик события клика
   * @param {MouseEvent} evt
   */
  prevButton.onclick = function(evt) {
    evt.preventDefault();

    filterForm.reset();
    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  };

  filterForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    docCookies.setItem('upload-filter', selectedFilter.value);
    uploadForm.classList.remove('invisible');
    filterForm.classList.add('invisible');

  });
  setFilter();

  /**
   * Устанавливает выбранный из куков фильтр
   */
  var restoreCookies = function() {

    if (docCookies.hasItem('upload-filter')) {
      selectedFilter.value = docCookies.getItem('upload-filter');
    }
  };
  restoreCookies(filterForm);
})();


