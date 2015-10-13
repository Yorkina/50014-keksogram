
(function() {

  var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };

  var filtersContainer = document.querySelector(".filters");
  var picContainer = document.querySelector(".pictures");
  var picTemplate = document.querySelector(".picture-template");
  var picFragment = document.createDocumentFragment();

  var IMAGE_FAILURE_TIMEOUT = 10000;
  var PAGE_SIZE = 12;

  var gallery = new Gallery();
  var currentPictures;
  var currentPage = 0;

  filtersContainer.classList.add('hidden');

  function failureSign(elem) {
    elem.classList.add('picture-load-failure');
  };

  function showPicFailure() {
    picContainer.classList.add('pictures-failure');
  };

  function renderPictures(picToRender, pageNumber, replace) {
    //нормализация для replace (из неизвестного значения делаем заведомо известное)
    //если не передан аргумент replace, то придет 'udef', и в зависимости от этого, вернется true/false

    replace = typeof replace !== 'undefined' ? replace : true;

    //если не передан номер страницы, то он равен нулю
    pageNumber = pageNumber || 0;

    if (replace) {
      picContainer.classList.remove('picture-load-failure');
      picContainer.innerHTML = '';
    }

    var picFrom = pageNumber * PAGE_SIZE;
    var picTo = picFrom + PAGE_SIZE;
    picToRender = picToRender.slice(picFrom, picTo);


    picToRender.forEach(function(photoData) {

      var newPicElement = new Photo(photoData);
      newPicElement.render(picFragment);

      picContainer.appendChild(picFragment);


      if (pictures['url']) {
        var picNew = new Image();
        var picOld = newPicElement.querySelector(".picture img");

        var picLoadTimeout = setTimeout(function() {
          failureSign(newPicElement);
        }, IMAGE_FAILURE_TIMEOUT);

        picNew.onerror = function(evt) {
          failureSign(newPicElement);
        };

        picNew.onload = function(evt) {
          this.setAttribute("width", 182);
          this.setAttribute("height", 182);
          clearTimeout(picLoadTimeout);
          newPicElement.replaceChild(picNew, picOld);
        };
        picNew.src = pictures['url'];
      }
    });

    picContainer.appendChild(picFragment);
  }

  function loadPic(callback) {
    var xhr = new XMLHttpRequest();
    xhr.timeout = IMAGE_FAILURE_TIMEOUT;
    xhr.open('get', 'data/pictures.json');
    picContainer.classList.add('pictures-loading');
    xhr.send();

    xhr.onreadystatechange = function(evt) {
      var loadedXhr = evt.target;

      switch (loadedXhr.readyState) {
        case ReadyState.OPENED:
        case ReadyState.HEADERS_RECEIVED:
        case ReadyState.LOADING:
          break;

        case ReadyState.DONE:
          picContainer.classList.remove('pictures-loading');
        default:
          if (xhr.status == 200) {
            var data = loadedXhr.response;
            callback(JSON.parse(data));
          }
          if (loadedXhr.status >= 400) {
            showPicFailure();
          }
          break;
      }
    };
    xhr.ontimeout = function() {
      showPicFailure();
    }
  }

  function filterPic(picturesToFilter, filterValue) {
    var filteredPic = picturesToFilter.slice(0);
    switch (filterValue) {
      case 'new':

        filteredPic = filteredPic.sort(function(a, b) {

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
        filteredPic = filteredPic.sort(function(a, b) {

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
      default:
      filteredPic = filteredPic.sort(function(a, b) {

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
      }
    localStorage.setItem('filterValue', filterValue);
    return filteredPic;
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
    currentPictures = filterPic(pictures, filterValue);
    currentPage = 0;
    renderPictures(currentPictures, currentPage++, true);
  };

  //КОД ДЛЯ СКРОЛЛА

  //определение максимального скролла вверх
  function isNextPageAvailable() {
    return currentPage < Math.ceil(pictures.length / PAGE_SIZE);
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
      renderPictures(currentPictures, currentPage++, false);
    });
  };

  function initGallery() {
    window.addEventListener('galleryclick', function(evt) {
      gallery.setPhotos(evt.detail.picElement._data.pictures);
      gallery.show();
    });
  }



  //запускаем функции фильтрации и скролла
  initFilters();
  initScroll();
  initGallery();

  loadPic(function(loadedPictures) {
    pictures = loadedPictures;
    setActiveFilter(localStorage.getItem('filterValue') || 'popular');
  });

  filtersContainer.classList.remove("hidden");
})();
