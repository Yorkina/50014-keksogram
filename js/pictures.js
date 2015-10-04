(function() {
  var filter = document.querySelector(".filters");
  filter.classList.add("hidden");

  var IMAGE_FAILURE_TIMEOUT = 10000;

  var picContainer = document.querySelector(".pictures");
  var picTemplate = document.getElementById("picture-template");

  var picFragment = document.createDocumentFragment();

  function failureSign (elem) {
    elem.classList.add('picture-load-failure');
  };

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
        failureSign (newPicElement);
      }, IMAGE_FAILURE_TIMEOUT);

      picNew.onerror = function(evt) {
        failureSign (newPicElement);
      };

      picNew.onload = function(evt) {
        this.setAttribute("width", 182);
        this.setAttribute("height", 182);
        clearTimeout(picLoadTimeout);
        newPicElement.replaceChild(picNew, picOld);
      }
      picNew.src = pictures['url'];
    }
  });
  picContainer.appendChild(picFragment);

  filter.classList.remove("hidden");
})();
