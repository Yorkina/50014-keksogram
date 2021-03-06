'use strict';

define(function() {
  var PhotoModel = Backbone.Model.extend({
    initialize: function() {
      this.set('liked', false);
    },

    like: function() {
      this.set('liked', true);
    },
    dislike: function() {
      this.set('liked', false);
    }
  });

  return PhotoModel;

});
