(function() {
  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  var pictureContainer = document.querySelector(".pictures");
  var galleryElement = document.querySelector(".gallery-overlay");
  var closeButton = galleryElement.querySelector(".gallery-overlay-close");

  function doesHaveParent(element, className) {
    //ползем по дому через parentElement и ищем, не тут ли кликнутый элемент
    do {
      if (element.classList.contains(className)) {
        return !element.classList.contains('picture-load-failure');
      }
      element = element.parentElement;
    } while (element);

    return false;
  };

  function hideGallery() {
    galleryElement.classList.add('invisible');
    closeButton.removeEventListener('click', closeHandler);
    document.body.removeEventListener('keydown', keyHandler);
  };

  function closeHandler(evt) {
    evt.preventDefault();
    hideGallery();
  };

  function keyHandler(evt) {
    switch (evt.keyCode) {
      case Key.LEFT:
        console.log('показываем предыдущее фото');
        break;
      case Key.RIGHT:
        console.log('показываем следующее фото');
        break;
      case Key.ESC:
        hideGallery();
        break;
    }
  };

  function showGallery() {
    galleryElement.classList.remove('invisible');
    closeButton.addEventListener('click', closeHandler);
    document.body.addEventListener('keydown', keyHandler);
  }

  //по клику проверяем, есть ли класс у контейнера картинки
  pictureContainer.addEventListener('click', function(evt) {
    evt.preventDefault();
    if (doesHaveParent(evt.target, 'picture')) {
      showGallery();
    }
  });

})();
