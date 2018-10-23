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

    //checking whether the user is logged in or not.. if not then redirecting him to the first page..
    if (localStorage.getItem("present-user") == null) {
      window.location = "./index.html";
    }

    //displaying only the first name in the top section..
    document.getElementById("user-name").innerHTML = currentUser.substr(
      0,
      currentUser.indexOf(" ")
    );
    setCategories(); //calling the method to set the top nav-bar based on the data
    bringFilter(); //calling the method to bring the filter sub-menu based on selected category
    displayItems(); //calling the method to display the items based on the selected category
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
  //displaying only the products based on the category selected
  for (var p of allProducts) {
    if (p.sub_category == localStorage.getItem("category")) {
      displayProduct.push(p);
    }
  }

  //dynamically creating a div for each item
  for (var product of displayProduct) {
    var item = document.createElement("div");
    item.setAttribute("id", product.id);
    item.setAttribute("class", "item");
    document.getElementById("display").appendChild(item);

    //item image set based on each product id
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

  //adding onclick listener on every items so that the item clicked gets displayed
  for (var p of displayProduct) {
    document.getElementById(p.id).addEventListener("click", e => {
      var tempId = e.target.id;
      tempId = tempId.slice(-3);
      localStorage.setItem("select-item", tempId);
      window.location = "./item.html";
    });
  }
};

/*
    @author : Dipmalya Sen
    @desc : This function closes the session of the logged in user
*/
var logOut = function() {
  localStorage.removeItem("present-user");
  window.location = "./index.html";
};

//The element object defines which values would be in filter for each category
var elements = {
  Mobile: ["brand", "price", "ram", "storage", "rear-camera", "front-camera"],
  Laptop: ["brand", "price", "ram", "storage", "processor", "os"],
  Camera: ["brand", "price", "type", "pixel"],
  Men: ["brand", "price", "type", "color"],
  Women: ["brand", "price", "type", "color"],
  furniture: ["brand", "price", "type"],
  sports: ["brand", "sports", "price", "Ideal For"],
  Watch: ["brand", "type", "price", "Screen"]
};

var uniqueBrands = new Set(); //This set is used for storing unique filter values for each category

/*
    @author : Dipmalya Sen
    @desc : This function dynamically fetches the filter sub-menu from the data
*/
var bringFilter = function() {
  var options = elements[localStorage.getItem("category") + ""];

  for (var num of options) {
    //applyFilter(num);
    uniqueBrands.clear();
    for (var p of allProducts) {
      if (p.sub_category == localStorage.getItem("category")) {
        uniqueBrands.add(p[num + ""]);
      }
    }

    var filters = document.createElement("li");
    filters.setAttribute("id", num);
    filters.innerHTML = num.toUpperCase();
    filters.addEventListener("click", displayFilter);
    document.getElementById("panel-tabs").appendChild(filters);

    var sub_panel = document.createElement("div");
    sub_panel.setAttribute("id", "sub-panel" + num);
    sub_panel.setAttribute("class", "sub-panel");
    document.getElementById("panel-tabs").appendChild(sub_panel);

    for (var u of uniqueBrands) {
      if (num != "price") {
        var prehtml = document.getElementById("sub-panel" + num).innerHTML;
        document.getElementById("sub-panel" + num).innerHTML =
          prehtml +
          "<input type='checkbox' name='" +
          num +
          "' value='" +
          u +
          "' onchange='applyFilter(" +
          num +
          ")'> " +
          u +
          "<br/>";
      }

      if (num == "price") {
        document.getElementById("sub-panel" + num).innerHTML =
          "<input type='range' id='" + num + "' min='500' max='100000'>";
      }
    }
  }
};

var applyFilter = function(e) {
  $("#display").empty();
  var i = document.getElementsByName(e.id);
  for (var j = 0; j < i.length; j++) {
    if (i[j].checked) {
      //i[j].value == value
      //i[j].name ==  category
      allProducts = [];
      for (var a of displayProduct) {
        if (a[i[j].name + ""] == i[j].value) {
          allProducts.push(a);
        }
      }
      displayProduct = [];
      console.log(allProducts);
      displayItems();
    }
  }
};
