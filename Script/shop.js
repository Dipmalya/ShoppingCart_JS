var allProducts = [];

var bringProducts = function() {
  $.get("../Data/product.json", function(product, status) {
    allProducts = product;
  });
};

var selectMobile = function() {
  for (var product of allProducts) {
    if (product.category === "Mobile") {
      //console.log(product.name);
    }
  }
};
