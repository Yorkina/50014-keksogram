(function() {
  var Key = {
    'ESC': 27,
    'LEFT': 37,
    'RIGHT': 39
  };

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  };

  var Gallery = function() {
    this._photos = new Backbone.Collection();

    this._element = document.querySelector(".gallery-overlay");
    this._closeButton = this._element.querySelector(".gallery-overlay-close");
    this._pictureElement = this._element.querySelector(".gallery-overlay-preview");

    this._currentPhoto = 0;

    this._onCloseClick = this._onCloseClick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
  };

  Gallery.prototype.show = function() {

    this._element.classList.remove('invisible');
    this._closeButton.addEventListener('click', this._onCloseClick);
    document.body.addEventListener('keydown', this._onKeyDown);
    this._showCurrentPhoto();
  };

  Gallery.prototype.hide = function() {
    this._element.classList.add('invisible');
    this._closeButton.removeEventListener('click', this._onCloseClick);
    document.body.removeEventListener('keydown', this._onKeyDown);

    this._photos.reset();
    this._currentPhoto = 0;
  };

  Gallery.prototype.setPhotos = function(photos) {
    debugger;
    this._photos.reset(photos.map(function(photoSrc) {
      debugger;
      return new Backbone.Model({
        url: photoSrc
      });
    }));
  };

  Gallery.prototype.setCurrentPhoto = function(index) {
    debugger;
    index = clamp(index, 0, this._photos.length + 1);
    debugger;

    if (this._currentPhoto === index) {
      debugger;
      this._showCurrentPhoto();
    } else {
      this._currentPhoto = index;
      this._showCurrentPhoto();
    }
  };

  Gallery.prototype._showCurrentPhoto = function() {

    this._pictureElement.innerHTML = '';
    debugger;
    console.log(this._pictureElement);
    debugger;
    var imageElement = new GalleryPicture({ model: this._photos.at(this._currentPhoto) });
    console.log(imageElement);
    debugger;
    imageElement.render();
    this._pictureElement.appendChild(imageElement.el);

  };

  Gallery.prototype._onCloseClick = function(evt) {
    evt.preventDefault();
    this.hide();
  };

  Gallery.prototype._onKeyDown = function(evt) {
    switch (evt.keyCode) {
      case Key.ESC:
        this.hide();
        break;

      case Key.LEFT:
        this.setCurrentPhoto(this._currentPhoto - 1);
        break;

      case Key.RIGHT:
        this.setCurrentPhoto(this._currentPhoto + 1);
        break;
    }
  };



  window.Gallery = Gallery;

})();
