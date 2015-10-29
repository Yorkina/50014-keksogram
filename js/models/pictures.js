'use strict';
/* global
  PhotoModel: true
*/

define([
  'models/photo'
], function(PhotoModel) {
  var PicturesCollection = Backbone.Collection.extend({
    model: PhotoModel,
    url: 'data/pictures.json'
  });


  return PicturesCollection;

});
