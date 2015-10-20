(function () {

    var PicturesCollection = Backbone.Collection.extend ({
        model: PhotoModel,
        url: 'data/pictures.json'
    });
    
    window.PicturesCollection = PicturesCollection;
})();