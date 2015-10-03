(function() {
  var filter = document.querySelector(".filters");
  filter.classList.add("hidden");

  var IMAGE_FAILURE_TIMEOUT = 10000;

  var picContainer = document.querySelector(".pictures");
  var picTemplate = document.getElementById("picture-template");

  var picFragment = document.createDocumentFragment();

  pictures.forEach(function(pictures, i) {

    var newPicElement = picTemplate.content.children[0].cloneNode(true);

    newPicElement.querySelector(".picture img");
    newPicElement.querySelector(".picture-comments").textContent = pictures['comments'];
    newPicElement.querySelector(".picture-likes").textContent = pictures['likes'];

    picFragment.appendChild(newPicElement);


    if (pictures['url']) {
      var picNew = new Image();
      picNew.src = pictures['url'];
      var picOld = newPicElement.querySelector(".picture img");

      var picLoadTimeout = setTimeout(function() {
        newPicElement.classList.add('picture-load-failure');
      }, IMAGE_FAILURE_TIMEOUT);

      picNew.onerror = function(evt) {
        newPicElement.classList.add('picture-load-failure');
      };

      picNew.onload = function(evt) {
        this.style.width = "185px";
        this.style.height = "185px";
        clearTimeout(picLoadTimeout);
      }
    }
    newPicElement.replaceChild(picNew, picOld);
  });
  picContainer.appendChild(picFragment);

  filter.classList.remove("hidden");
})();
