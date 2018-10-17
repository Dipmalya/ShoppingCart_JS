var allProducts = [];
var categories = new Set();
var sub_categories = new Map();

var bringProducts = function() {
  $.get("../Data/product.json", function(product, status) {
    allProducts = product;
    selectMobile();
  });
};

var selectMobile = function() {
  for (var product of allProducts) {
    categories.add(product.category);
    sub_categories.set(product.category, product.sub_category);
  }
  categories = Array.from(categories);
  sub_categories = Array.from(sub_categories);

  console.log(sub_categories);

  var ul = document.getElementById("navTabs");
  for (var item of categories) {
    console.log(item);
    var li = document.createElement("li");
    li.className = item;
    li.innerHTML = (item + "").toUpperCase();
    var sub_ul = document.createElement("ul");
    sub_ul.id = "drop-" + item;
    li.appendChild(sub_ul);
    ul.appendChild(li);
    for (var i of sub_categories) {
      if (i[0] == item) {
        var sub_li = document.createElement("li");
        sub_li.setAttribute("id", i[1]);
        sub_li.innerHTML = i[1].toUpperCase();
        console.log(sub_li);
        console.log(document.getElementById("drop-" + i[0]));
        document.getElementById("drop-" + i[0]).appendChild(sub_li);
      }
    }
  }
};
