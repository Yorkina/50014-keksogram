(function() {

  var ReadyState = {
    'UNSENT': 0,
    'OPENED': 1,
    'HEADERS_RECEIVED': 2,
    'LOADING': 3,
    'DONE': 4
  };


  var filter = document.querySelector(".filters");
  var picContainer = document.querySelector(".pictures");
  var picTemplate = document.getElementById('picture-template');
  var picFragment = document.createDocumentFragment();

  var IMAGE_FAILURE_TIMEOUT = 10000;

  filter.classList.add('hidden');

  function failureSign(elem) {
    elem.classList.add('picture-load-failure');
  };

  function showPicFailure() {
    picContainer.classList.add('pictures-failure');
  }

  function renderPictures(pictures) {
    picContainer.innerHTML = '';

    pictures.forEach(function(pictures, i) {

      var newPicElement = picTemplate.content.children[0].cloneNode(true);

      newPicElement.querySelector(".picture img");
      newPicElement.querySelector(".picture-comments").textContent = pictures['comments'];
      newPicElement.querySelector(".picture-likes").textContent = pictures['likes'];

      picFragment.appendChild(newPicElement);


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
        default:
          picContainer.classList.remove('pictures-loading');
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

  function filterPic(pictures, filterValue) {
    var filteredPic = pictures.slice(0);
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
        filteredPic = pictures.slice(0);
        break;
    }
    return filteredPic;
  }

  function initFilters() {
    var filterElements = document.querySelectorAll('.filters-radio');
    for (var i = 0; i < filterElements.length; i++) {
      filterElements[i].onchange = function(evt) {
        var clickedFilter = evt.currentTarget;
        setActiveFilter(clickedFilter.value);
      };
    }
  }

  function setActiveFilter(filterValue) {
    var filteredPic = filterPic(pictures, filterValue);
    renderPictures(filteredPic);
  }

  initFilters();

  loadPic(function(loadedPictures) {
    pictures = loadedPictures;
    setActiveFilter('popular');
  });

  filter.classList.remove("hidden");
})();
