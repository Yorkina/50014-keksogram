'use strict';

define(function() {
  /**
  * @const
  * @type {number}
  */
  var IMAGE_FAILURE_TIMEOUT = 10000;
  /**
   * @type {Element}
   */
  var pictureTemplate = document.querySelector('.picture-template');
  /**
   * @constructor
   * @extends {Backbone.View}
   */
  var PhotoView = Backbone.View.extend({

    initialize: function() {

      this._onImageLoad = this._onImageLoad.bind(this);
      this._onImageFail = this._onImageFail.bind(this);
      this._onModelLike = this._onModelLike.bind(this);
      this._onClick = this._onClick.bind(this);

      this.model.on('change:liked', this._onModelLike);
    },
    /**
     * @type {Object.<string, string>}
     */
    events: {
      'click': '_onClick'
    },
    /**
     * Тег, использующийся для элемента представления.
     * @type {string}
     * @override
     */
    tagName: 'a',
    /**
     * Класс элемента.
     * @type {string}
     * @override
     */
    className: 'picture',

    el: function() {
      return pictureTemplate.content.children[0].cloneNode(true);
    },


    render: function() {
      this.el.querySelector('.picture-comments').textContent = this.model.get['comments'];
      this.el.querySelector('.picture-likes').textContent = this.model.get['likes'];

      if (this.model.get('url')) {
        var pictureReplace = new Image();
        var pictureDeleted = this.el.querySelector('.picture img');
        pictureReplace.src = this.model.get('url');


        this._imageLoadTimeout = setTimeout(function() {
          this.el.classList.add('picture-load-failure');
        }.bind(this), IMAGE_FAILURE_TIMEOUT);

        pictureReplace.addEventListener('load', this._onImageLoad);
        pictureReplace.addEventListener('error', this._onImageFail);
        pictureReplace.addEventListener('abort', this._onImageFail);

        pictureDeleted.parentNode.replaceChild(pictureReplace, pictureDeleted);

      }
      this._updateLike();
    },
    /**
     * Обработчик кликов по элементу.
     * @param {MouseEvent} evt
     * @private
     */
    _onClick: function(evt) {
      evt.preventDefault();
      console.log(evt.target);
      var clickedElement = evt.target.parentNode;
      if (clickedElement.classList.contains('picture') &&
        !clickedElement.classList.contains('picture-load-failure')) {
        this.trigger('galleryclick');
      }

      if (evt.target.classList.contains('picture-likes')) {
        if (this.model.get('liked')) {
          this.model.dislike();
        } else {
          this.model.like();
        }
      }
    },
    /**
     * @param {Event} evt
     * @private
     */
    _onImageLoad: function(evt) {
      clearTimeout(this._imageLoadTimeout);
      var loadedImage = evt.path[0];
      this._cleanupImageListeners(loadedImage);
      evt.path[0].setAttribute('height', 182);
      evt.path[0].setAttribute('width', 182);
    },

     /**
     * @param {Event} evt
     * @private
     */
    _onImageFail: function(evt) {
      var failedImage = evt.path[0];
      this._cleanupImageListeners(failedImage);
      failedImage.src = 'failed.jpg';
      this.el.classList.add('picture-load-failure');
    },
    /**
     * @private
     */
    _onModelLike: function() {
      this._updateLike();
    },
    /**
     * @private
     */
    _updateLike: function() {
      var likeButton = this.el.querySelector('.picture-likes');

      if (likeButton) {
        likeButton.classList.toggle('picture-likes-liked', this.model.get('liked'));
      }
    },
    /**
     * Удаление обработчиков событий на элементе.
     * @param {Image} image
     * @private
     */
    _cleanupImageListeners: function(image) {
      image.removeEventListener('load', this._onImageLoad);
      image.removeEventListener('error', this._onImageFail);
      image.removeEventListener('abort', this._onImageFail);
    }
  });

  return PhotoView;
});
