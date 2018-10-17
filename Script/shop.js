var allProducts = [];
var categories = new Set();

var bringProducts = function() {
  $.get("../Data/product.json", function(product, status) {
    allProducts = product;
    selectMobile();
  });
};

var selectMobile = function() {
  for (var product of allProducts) {
    categories.add(product.category);
  }
  categories = Array.from(categories);
  var ul = document.getElementById("navTabs");
  for (var item of categories) {
    console.log(item);
    var li = document.createElement("li");
    li.className = item;
    li.innerHTML = (item + "").toUpperCase();
    ul.appendChild(li);
  }
  //console.log(categories[0]);
};
