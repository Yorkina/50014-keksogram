'use strict';

requirejs.config({
  baseUrl: 'js'
});

define([
  'gallery',
  'models/photo',
  'models/pictures',
  'views/photo',
  'views/gallery-picture',
  'logo-background',
  'upload-form',
  'filter-form',
  'resize-form',
  'resize-picture'
], function(Gallery, PhotoModel, PicturesCollection, PhotoView, GalleryPicture) {
  /**
   * @type {Element}
   */
  var filtersContainer = document.querySelector('.filters');
  var picContainer = document.querySelector('.pictures');
  var filterNew = document.querySelector('#filter-new');
  var filterPopular = document.querySelector('#filter-popular');
  var filterDiscussed = document.querySelector('#filter-discussed');
  /**
  * @const
  * @type {number}
  */
  var IMAGE_FAILURE_TIMEOUT = 10000;
  /**
  * @const
  * @type {number}
  */
  var PAGE_SIZE = 12;
   /**
   * @type {Gallery}
   */
  var gallery = new Gallery();
   /**
   * @type {number}
   */
  var currentPage = 0;
  var REG_EXP = /^#filters\/(\S+)$/;


  filtersContainer.classList.add('hidden');

  function parseURL() {
    var stringHash = location.hash;
    var filterName = stringHash.match(REG_EXP);
    if (filterName) {
      setActiveFilter(filterName[1] || 'popular');
    }
  }



  function showPicFailure() {
    picContainer.classList.add('pictures-failure');
  }
  /**
   * @type {picturesCollection}
   */
  var picturesCollection = new PicturesCollection();
   /**
   * @type {Array}
   */
  var initiallyLoaded = [];
  var renderedViews = [];

   /**
   * @param  {number} pageNumber
   * @param  {boolean} replace
   */

  function renderPictures(pageNumber, replace) {
    var fragment = document.createDocumentFragment();
    var picFrom = pageNumber * PAGE_SIZE;
    var picTo = picFrom + PAGE_SIZE;

    if (replace) {
      while (renderedViews.length) {
        var viewToRemove = renderedViews.shift();
        picContainer.removeChild(viewToRemove.el);
        viewToRemove.off('galleryclick');
        viewToRemove.remove();
      }
    }

    picturesCollection.slice(picFrom, picTo).forEach(function(model) {

      var view = new PhotoView({model: model});
      view.render();
      fragment.appendChild(view.el);
      renderedViews.push(view);

      view.on('galleryclick', function() {
        gallery.setPhotos(picturesCollection);
        gallery.setCurrentPhoto(picturesCollection.models.indexOf(model));
        gallery.show();
      });
      return view;
    });

    picContainer.appendChild(fragment);
  }
  /*
  * @param  {string} filterValue
  * @return {Array}
  */
  function addFilterBackgroundColor() {
    var filterName = location.hash.match(REG_EXP) || 'popular';
    if (filterName[1]) {
      switch (filterName[1]) {
        case 'new':
          filterNew.checked = true;
          break;
        case 'discussed':
          filterDiscussed.checked = true;
          break;
        case 'popular':
        default:
          filterPopular.checked = true;
          break;
      }
    }
  }

  function filterPic(filterValue) {
    var list = initiallyLoaded.slice(0);
    switch (filterValue) {
      case 'new':

        list.sort(function(a, b) {

          if (a.date > b.date) {
            return -1;
          }

          if (a.date === b.date) {
            return 0;
          }

          if (a.date < b.date) {
            return 1;
          }
        });
        break;

      case 'discussed':
        list.sort(function(a, b) {

          if (a.comments > b.comments) {
            return -1;
          }

          if (a.comments === b.comments) {
            return 0;
          }

          if (a.comments < b.comments) {
            return 1;
          }
        });
        break;

      case 'popular':
        list.sort(function(a, b) {

          if (a.likes > b.likes) {
            return -1;
          }

          if (a.likes === b.likes) {
            return 0;
          }

          if (a.likes < b.likes) {
            return 1;
          }
        });
        break;

      default:
        list.slice(0);
    }

    picturesCollection.reset(list);
  }

  function initFilters() {
    filtersContainer.addEventListener('click', function(evt) {
      var clickedFilter = evt.target;
      location.hash = 'filters/' + clickedFilter.value;
      clickedFilter.checked = true;
    });
  }
  //функция установки фильтра
  /*
  *@param {string} filterValue
  */
  function setActiveFilter(filterValue) {
    //перезаписываем список картинок которые у нас есть
    filterPic(filterValue);
    currentPage = 0;
    //gallery.setPhotos(currentPictures);
    renderPictures(currentPage++, true);
  }

  //КОД ДЛЯ СКРОЛЛА

  /**
  * Проверяет можно ли отрисовать следующую страницу списка отелей.
  * @return {boolean}
  */
  function isNextPageAvailable() {
    return currentPage < Math.ceil(picturesCollection.length / PAGE_SIZE);
  }

  /**
  * Проверяет, находится ли скролл внизу страницы.
  * @return {boolean}
  */
  function isAtTheBottom() {
    var GAP = 100;
    //проверяем где низ контейнера с картинками
    return picContainer.getBoundingClientRect().bottom - GAP <= window.innerHeight;
  }

  function checkNextPage() {
    if (isAtTheBottom() && isNextPageAvailable()) {
      //выстреливатель события которое отрисовывает отели
      window.dispatchEvent(new CustomEvent('loadneeded'));
    }
  }
  //функция скролла
  function initScroll() {
    var someTimeout;
    window.addEventListener('scroll', function() {
      clearTimeout(someTimeout);
      someTimeout = setTimeout(checkNextPage, 100);
    });

    //отрисовка отелей по событию из ф-ии checkNextPage
    window.addEventListener('loadneeded', function() {
      renderPictures(++currentPage, false);
    });
  }

  /**
   * @type {PicturesCollection}
   */
  picturesCollection.fetch({ timeout: IMAGE_FAILURE_TIMEOUT }).success(function(loaded, state, jqXHR) {
    initiallyLoaded = jqXHR.responseJSON;

    window.addEventListener('hashchange', function() {
      parseURL();
    });

    initFilters();
    initScroll();
    parseURL();

  }).fail(function() {
    showPicFailure();
  });


  filtersContainer.classList.remove('hidden');
  addFilterBackgroundColor();
});
