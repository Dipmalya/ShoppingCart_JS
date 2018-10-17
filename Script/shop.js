var bringProducts = function() {
  $.get("../Data/product.json", function(product, status) {
    for (var p of product) {
      if (p.brand == "Xiaomi") console.log(p);
    }
  });
};
