var allProducts = []; //array stores all the data
var categories = new Set(); //set to store the categories
var sub_categories = new Map(); //map to map the categories with the sub-categories
var currentUser = localStorage.getItem("present-user"); //stores the name of the user logged-in
var total = 0;

/*
    @author : Dipmalya Sen
    @desc : This function loads the data initially from the json file,
            calls the function to load the nav bar as per categories available,
            display the items,
            fetches the name of the user logged-in
*/
var bringProducts = function() {
  $.get("http://localhost:4010/rest/api/get", function(product, status) {
    allProducts = product;

    if (localStorage.getItem("present-user") == null) {
      window.location = "./index.html";
    }

    document.getElementById("user-name").innerHTML = currentUser.substr(
      0,
      currentUser.indexOf(" ")
    );
    setCategories();
    fillCart();
  });
};

/*
    @author : Dipmalya Sen
    @desc : This function creates the nav-bar dynamically based on the categories available in the file
*/
var setCategories = function() {
  for (var product of allProducts) {
    categories.add(product.category);
    sub_categories.set(product.sub_category, product.category);
  }
  categories = Array.from(categories);
  sub_categories = Array.from(sub_categories);

  var ul = document.getElementById("navTabs");

  //creating the nav bar tabs
  for (var item of categories) {
    var li = document.createElement("li");
    li.className = item;
    li.innerHTML = (item + "").toUpperCase();
    var sub_ul = document.createElement("ul");
    sub_ul.id = "drop-" + item;
    li.appendChild(sub_ul);
    ul.appendChild(li);

    //creating the drop-down sub items
    for (var i of sub_categories) {
      if (i[1] == item) {
        var sub_li = document.createElement("li");
        sub_li.setAttribute("id", i[0]);
        sub_li.innerHTML = i[0].toUpperCase();
        document.getElementById("drop-" + i[1]).appendChild(sub_li);
      }
    }
  }

  for (var p of sub_categories) {
    document.getElementById(p[0]).addEventListener("click", e => {
      localStorage.setItem("category", e.target.id);
      window.location = "./shop.html";
    });
  }
};

var fillCart = function() {
  var cart_items = localStorage.getItem("cart");
  var cart_count = new Map();
  var cart_set = new Set();
  if (cart_items.length > 0) var cItem = JSON.parse(cart_items);
  if (cItem != null) {
    for (var c of cItem) {
      cart_set.add(c.id);
      var count = 0;
      for (var d of cItem) {
        if (c.id == d.id) count++;
      }
      cart_count.set(c.id, count);
      count = 0;
    }
    //var cart_map = Array.from(cart_count);
    //console.log(cart_count);
  }
  var i = 0;
  for (var count of cart_set.keys()) {
    var name = "abc";
    var price = "abc";
    var cartItem = document.createElement("div");
    cartItem.setAttribute("id", "cart-item" + i);
    cartItem.setAttribute("class", "cart-item");
    var cartImage = document.createElement("div");
    cartImage.setAttribute("id", "cart-image" + i);
    cartImage.setAttribute("class", "cart-image");
    var image = document.createElement("img");
    image.setAttribute("id", "cartImage");

    document.getElementById("cart-list").appendChild(cartItem);
    document.getElementById("cart-item" + i).appendChild(cartImage);
    document.getElementById("cart-image" + i).appendChild(image);

    var cartDesc = document.createElement("div");
    cartDesc.setAttribute("id", "cart-desc" + i);
    cartDesc.setAttribute("class", "cart-desc");
    document.getElementById("cart-item" + i).appendChild(cartDesc);
    document.getElementById("cart-desc" + i).innerHTML =
      "<table id='cart-table'><tr><th>Name</th><td id='cartItem-name" +
      i +
      "'></td></tr><tr><th>Price</th><td id='cartItem-price" +
      i +
      "'></td></tr><tr><th>Quantity</th><td><input type='number' class='qty' id='qty" +
      i +
      "' min='1' value='1' onchange='qtyChange(id)'/></td></tr><tr><th>Total</th><td id='total-item" +
      i +
      "'></td></tr></table><input type='button' class='btn btn-danger' id='remove" +
      count +
      "' value='Remove from Cart' onclick='removeFromCart()'/>";

    for (var product of allProducts) {
      if (product.id == count) {
        // removeFromCart.apply(count);
        image.setAttribute("src", product.image[0]);
        name = product.name;
        price = product.price;
        total += eval(price);
        document.getElementById("total").innerHTML = total;
        console.log(name, price);
        document.getElementById("cartItem-name" + i).innerHTML = name;
        document.getElementById("cartItem-price" + i).innerHTML =
          "Rs. " + price;
        document.getElementById("total-item" + i).innerHTML = "Rs. " + price;
        break;
      }
    }
    i++;
  }
};

var qtyChange = function(e) {
  var id = e.slice(-1);
  var qty = document.getElementById("qty" + id).value;
  var init_total = document.getElementById("total-item" + id).innerHTML;
  init_total = eval(init_total.slice(4));
  var price = document.getElementById("cartItem-price" + id).innerHTML;
  var price = price.slice(4);

  document.getElementById("total-item" + id).innerHTML =
    "Rs. " + eval(qty) * eval(price);

  var change =
    eval(document.getElementById("total-item" + id).innerHTML.slice(4)) -
    init_total;
  console.log(document.getElementById("total").innerHTML);
  document.getElementById("total").innerHTML =
    eval(document.getElementById("total").innerHTML) + eval(change);
};

var removeFromCart = function() {
  var index = window.event.target.id.toString();
  index = index.slice(-3);
  var cart_i = localStorage.getItem("cart");
  var cItems = JSON.parse(cart_i);
  for (var c = 0; c < cItems.length; c++) {
    if (cItems[c].id == index) {
      cItems.splice(c, 1);
    }
  }
  var cart = JSON.stringify(cItems);
  localStorage.setItem("cart", cart);
  window.location = "./cart.html";
};

var goBack = function() {
  window.location = "./home.html";
};

var buyNow = function() {
  alert("Thank you shopping with us!!");
  localStorage.removeItem("cart");
  window.location = "./home.html";
};

var logOut = function() {
  localStorage.removeItem("present-user");
  window.location = "./index.html";
};
