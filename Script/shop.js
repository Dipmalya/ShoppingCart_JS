var allProducts = []; //array stores all the data
var displayProduct = [];
var categories = new Set(); //set to store the categories
var sub_categories = new Map(); //map to map the categories with the sub-categories
var currentUser = localStorage.getItem("present-user"); //stores the name of the user logged-in

/*
    @author : Dipmalya Sen
    @desc : This function loads the data initially from the json file,
            calls the function to load the nav bar as per categories available,
            display the items,
            fetches the name of the user logged-in
*/
var bringProducts = function() {
  $.get("../Data/product.json", function(product, status) {
    allProducts = product;

    if (localStorage.getItem("present-user") == null) {
      window.location = "./index.html";
    }

    document.getElementById("user-name").innerHTML = currentUser.substr(
      0,
      currentUser.indexOf(" ")
    );
    setCategories();
    bringFilter();
    displayItems();
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
  //console.log(sub_categories[0][0]);
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

  //for category-wise filter
  for (var p of sub_categories) {
    document.getElementById(p[0]).addEventListener("click", e => {
      localStorage.setItem("category", e.target.id);
      location.reload();
    });
  }
};

/*
    @author : Dipmalya Sen
    @desc : This function toggles the collapsable filter menu
*/
var displayFilter = function() {
  if ($("#sub-panel").css("display") == "none")
    $("#sub-panel").css("display", "block");
  else $("#sub-panel").css("display", "none");
};

/*
    @author : Dipmalya Sen
    @desc : This function dynamically fetches the data from the json file,
            adds the image and name
*/
var displayItems = function() {
  for (var p of allProducts) {
    if (p.sub_category == localStorage.getItem("category")) {
      displayProduct.push(p);
    }
  }

  for (var product of displayProduct) {
    var item = document.createElement("div");
    item.setAttribute("id", product.id);
    item.setAttribute("class", "item");
    document.getElementById("display").appendChild(item);

    var image = document.createElement("img");
    image.setAttribute("src", product.image[0]);
    image.setAttribute("class", "item-image");
    image.setAttribute("id", "item-image" + product.id);
    document.getElementById(product.id).appendChild(image);

    var name_div = document.createElement("div");
    name_div.setAttribute("id", "item" + product.id);
    name_div.setAttribute("class", "item-details");
    document.getElementById(product.id).appendChild(name_div);

    var itemName = document.createElement("h4");
    itemName.setAttribute("id", product.name + product.id);
    document.getElementById("item" + product.id).appendChild(itemName);
    document.getElementById(product.name + product.id).innerHTML =
      product.name + "<br/>" + "Rs. " + product.price;
  }

  for (var p of displayProduct) {
    document.getElementById(p.id).addEventListener("click", e => {
      var tempId = e.target.id;
      tempId = tempId.slice(-3);
      localStorage.setItem("select-item", tempId);
      window.location = "./item.html";
    });
  }
};

var logOut = function() {
  localStorage.removeItem("present-user");
  window.location = "./index.html";
};

// var Mobile = ["brand", "price", "ram", "storage", "rear-camera", "fron-camera"];
// var Laptop = ["brand", "price", "ram", "storage", "processor", "os"];
// var Camera = ["brand", "price", "type", "pixel"];
var elements = {
  Mobile: ["brand", "price", "ram", "storage", "rear-camera", "fron-camera"],
  Laptop: ["brand", "price", "ram", "storage", "processor", "os"],
  Camera: ["brand", "price", "type", "pixel"],
  Men: ["brand", "price", "type", "color"],
  Women: ["brand", "price", "type", "color"],
  furniture: ["brand", "price", "type"],
  sports: ["brand", "sports", "price", "Ideal For"],
  Watch: ["brand", "type", "price", "Screen"]
};

var bringFilter = function() {
  var options = elements[localStorage.getItem("category") + ""];
  for (var num of options) {
    var filters = document.createElement("li");
    filters.setAttribute("id", num);
    filters.innerHTML = num.toUpperCase();
    filters.addEventListener("click", displayFilter);
    document.getElementById("panel-tabs").appendChild(filters);
    // var sub_panel = document.createElement("div");
    // sub_panel.setAttribute("id", "sub-panel");
    // document.getElementById("panel-tabs").appendChild(sub_panel);
    // document.getElementById('sub-panel').innerHTML = "<input type='checkbox' name='RAM' value='2gb'> 2GB"
  }
};
