var allProducts = []; //array stores all the data
var categories = new Set(); //set to store the categories
var sub_categories = new Map(); //map to map the categories with the sub-categories
var currentUser = localStorage.getItem("present-user"); //stores the name of the user logged-in
var cart = [];

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
    bringItem();
    if (localStorage.getItem("cart") != null) {
      var cart_items = localStorage.getItem("cart");
      var cItem = JSON.parse(cart_items);
      for (var c of cItem) cart.push(c);
    }
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

/*
    @author : Dipmalya Sen
    @desc : When user clicks on any individual item that item will be displayed..
*/
var bringItem = function() {
  var selected_item = localStorage.getItem("select-item");
  for (var item of allProducts) {
    if (item.id == selected_item) {
      document.getElementById("image").setAttribute("src", item.image[0]);
      var table = document.getElementById("item-table");
      var keys = Object.keys(item);
      var values = Object.values(item);
      for (var num = 4; num < keys.length; num++) {
        if (keys[num] == "image") continue;
        if (keys[num] == "price") {
          values[num] = "Rs. " + values[num];
        }
        var tRow = document.createElement("tr");
        var tHead = document.createElement("th");
        var tData = document.createElement("td");
        tHead.innerHTML = (keys[num] + "").toUpperCase();
        tData.innerHTML = values[num];
        tRow.appendChild(tHead);
        tRow.appendChild(tData);
        table.appendChild(tRow);
      }
    }
  }
};

/*
    @author : Dipmalya Sen
    @desc : When user clicks on add to cart button on item page this method is called..
            This method uses local storage to store items.
            Pushes each object to cart array and then saves it
*/
var addToCart = function() {
  var selected_item = localStorage.getItem("select-item");
  for (var product of allProducts) {
    if (product.id == selected_item) {
      cart.push(product);
      break;
    }
  }
  var cart_text = JSON.stringify(cart);
  localStorage.setItem("cart", cart_text);
  alert("Item successfully added to cart!");
};

/*
    @author : Dipmalya Sen
    @desc : When user clicks on log out, the session gets closed and the user is redirected to the index page
*/
var logOut = function() {
  localStorage.removeItem("present-user");
  window.location = "./index.html";
};

/*
    @author : Dipmalya Sen
    @desc : When user clicks on buy now button on item page this method is called
*/
var buyNow = function() {
  alert("Thank you shopping with us!!");
  window.location = "./home.html";
};
