var allProducts = [];
var categories = new Set();
var sub_categories = new Map();
var currentUser = localStorage.getItem("present-user");

var bringProducts = function() {
  $.get("../Data/product.json", function(product, status) {
    allProducts = product;

    document.getElementById("user-name").innerHTML = currentUser.substr(
      0,
      currentUser.indexOf(" ")
    );
    setCategories();
    displayItems();
  });
};

var setCategories = function() {
  for (var product of allProducts) {
    categories.add(product.category);
    sub_categories.set(product.sub_category, product.category);
  }
  categories = Array.from(categories);
  sub_categories = Array.from(sub_categories);

  var ul = document.getElementById("navTabs");

  for (var item of categories) {
    var li = document.createElement("li");
    li.className = item;
    li.innerHTML = (item + "").toUpperCase();
    var sub_ul = document.createElement("ul");
    sub_ul.id = "drop-" + item;
    li.appendChild(sub_ul);
    ul.appendChild(li);

    for (var i of sub_categories) {
      if (i[1] == item) {
        var sub_li = document.createElement("li");
        sub_li.setAttribute("id", i[0]);
        sub_li.innerHTML = i[0].toUpperCase();
        document.getElementById("drop-" + i[1]).appendChild(sub_li);
      }
    }
  }
};

var displayFilter = function() {
  if ($("#sub-panel").css("display") == "none")
    $("#sub-panel").css("display", "block");
  else $("#sub-panel").css("display", "none");
};

var displayItems = function() {
  for (var product of allProducts) {
    console.log(product);
    var item = document.createElement("div");
    item.setAttribute("id", product.id);
    item.setAttribute("class", "item");
    document.getElementById("display").appendChild(item);

    var image = document.createElement("img");
    image.setAttribute("src", product.image[0]);
    image.setAttribute("id", "item-image");
    document.getElementById(product.id).appendChild(image);

    var name_div = document.createElement("div");
    name_div.setAttribute("id", "item" + product.id);
    name_div.setAttribute("class", "item-details");
    document.getElementById(product.id).appendChild(name_div);

    var itemName = document.createElement("h4");
    itemName.setAttribute("id", product.name);
    document.getElementById("item" + product.id).appendChild(itemName);
    document.getElementById(product.name).innerHTML =
      product.name + "<br/>" + "Rs. " + product.price;
  }
};
