(function() {

  var filtersContainer = document.querySelector(".filters");
  var picContainer = document.querySelector(".pictures");
  var picTemplate = document.querySelector(".picture-template");

  var IMAGE_FAILURE_TIMEOUT = 10000;
  var PAGE_SIZE = 12;

  var gallery = new Gallery();
  var currentPage = 0;


  filtersContainer.classList.add('hidden');


  function showPicFailure() {
    picContainer.classList.add('pictures-failure');
  }

  var picturesCollection = new PicturesCollection();
  var initiallyLoaded = [];
  var renderedViews = [];
  var pictureToRender = [];

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
      pictureToRender.push(view.el);

      view.on('galleryclick', function() {
        debugger;
        gallery.setPhotos(picturesCollection);
        gallery.setCurrentPhoto(picturesCollection.models.indexOf(model));
        gallery.show();
      });
      return view;
    });

    picContainer.appendChild(fragment);
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
    localStorage.setItem('filterValue', filterValue);
  };

  function initFilters() {
    //ищем контейнер, в котором лежат фильтры(NB! - уже есть переменная filter)
    //filtersContainer = document.querySelector('.filters');

    filtersContainer.addEventListener('click', function(evt) {
      //в перменную записываем кликнутый элемент (эта информация содержится в объекте event)
      var clickedFilter = evt.target;
      setActiveFilter(clickedFilter.value);
    });
  };
  //функция установки фильтра
  function setActiveFilter(filterValue) {
    //перезаписываем список картинок которые у нас есть
    filterPic(filterValue);
    currentPage = 0;
    //gallery.setPhotos(currentPictures);
    renderPictures(currentPage++, true);
  };

  //КОД ДЛЯ СКРОЛЛА

  //определение максимального скролла вверх
  function isNextPageAvailable() {
    return currentPage < Math.ceil(picturesCollection.length / PAGE_SIZE);
  };

  //определние низа страницы, чтобы подгружать новые картинки
  function isAtTheBottom() {
    var GAP = 100;
    //проверяем где низ контейнера с картинками
    return picContainer.getBoundingClientRect().bottom - GAP <= window.innerHeight;
  };

  function checkNextPage() {
    if (isAtTheBottom() && isNextPageAvailable()) {
      //выстреливатель события которое отрисовывает отели
      window.dispatchEvent(new CustomEvent('loadneeded'));
    }
  };
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
  };

  /*function initGallery() {
    window.addEventListener('galleryclick', function(evt) {
      evt.preventDefault();
      debugger;
      console.log(evt.detail.pictureElement._data.number);
      gallery.setPhotos(currentPictures);
      gallery.setCurrentPhoto(evt.detail.picElement._element.dataset.number);
      gallery.show();
    });
  };*/



 
  //initScroll();
  //initGallery();

  picturesCollection.fetch({ timeout: IMAGE_FAILURE_TIMEOUT }).success(function(loaded, state, jqXHR) {
    initiallyLoaded = jqXHR.responseJSON;
    initFilters();
    initScroll();

    setActiveFilter(localStorage.getItem('filterValue') || 'popular');
  }).fail(function() {
    showPicFailure();
  });

  filtersContainer.classList.remove("hidden");
})();
