(function() {

  var picTemplate = document.querySelector(".picture-template");
  var picContainer = document.querySelector(".pictures");

  var IMAGE_FAILURE_TIMEOUT = 10000;

  function failureSign(elem) {
    elem.classList.add('picture-load-failure');
  };

  function showPicFailure() {
    picContainer.classList.add('pictures-failure');
  };

  //Создаем конструктор с ОБЩИМИ для всех объектов, которые мы будем отпочковывать от него, методами

  //функция конструктор которая привязывает через bind this ко всем, 
  //наследуемым от нее объектам(Photo с большой буквы так как конструктор)
  //если вызовем ее через new то получим новый объект от ЭТОГО объекта
  var Photo = function(data) {
    this._data = data;
    this._onClick = this._onClick.bind(this);
  };

  //создаем метод render для объекта Photo который занимается тем, 
  // что наполняет наш шаблон реальными элементами
  /*Photo.prototype.render = function(container) {
    //есть аргумен контейнер(то есть мы можем это все отрисовать в ЛЮБОЙ контейнер теперь)
    var newPicElement = picTemplate.content.children[0].cloneNode(true);

    newPicElement.querySelector(".picture-comments").textContent = this._data['comments'];
    newPicElement.querySelector(".picture-likes").textContent = this._data['likes'];


    container.appendChild(newPicElement);

    if (this._data['url']) {
      var picNew = new Image();
      var picOld = newPicElement.querySelector(".picture img");
      var counter = 0;
      var picCounter = document.querySelectorAll(".pictures a");
        for (var i = 0; picCounter.length > i; i++) {
          counter++;
        };

      var picLoadTimeout = setTimeout(function() {
        failureSign(newPicElement);
      }, IMAGE_FAILURE_TIMEOUT);

      picNew.onload = function() {
        this.setAttribute("width", 182);
        this.setAttribute("height", 182);
        clearTimeout(picLoadTimeout);
        newPicElement.replaceChild(picNew, picOld);
        this.parentNode.setAttribute("data-number", counter);
      };

      picNew.onerror = function() {
        failureSign(newPicElement);
      };

      picNew.src = this._data['url'];
      this._element = newPicElement;
      this._element.addEventListener('click', this._onClick);
    };

    //создаем метод unrender для объекта Photo который удаляет
    Photo.prototype.unrender = function() {
      this._element.parentNode.removeChild(this._element);
      this._element.removeEventListener('click', this._onClick);
      this._element = null;
    };
  };

  //Если нет непрогруженных фото, все остальные грузить
  Photo.prototype._onClick = function(evt) {
    evt.preventDefault();
    if (!this._element.classList.contains('picture-load-failure')) {
      var galleryEvent = new CustomEvent('galleryclick', {
        detail: { picElement: this }
      });
      window.dispatchEvent(galleryEvent);
    }
  };*/

  //Получить фото из объекта data_.
  //Photo.prototype.getPhotos = function() {
  //return this._data.pictures;
  //console.log(this._data.pictures);
  //};
  //Выносим в глобальную область видимости конструктор Photo
  window.Photo = Photo;


})();
