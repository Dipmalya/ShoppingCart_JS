var allProducts = []; //array stores all the data
var restLink = "http://localhost:4010/rest/api/delete/";

var bringProducts = function() {
  $.get("http://localhost:4010/rest/api/get", function(product, status) {
    allProducts = product;

    fillTable(allProducts);
  });
};

var fillTable = function(products) {
  for (var product of products) {
    var tRow = document.createElement("tr");
    tRow.setAttribute("id", product.id);
    document.getElementById("tData").appendChild(tRow);

    var tD = document.createElement("td");
    tD.innerHTML = product.id;
    document.getElementById(product.id).appendChild(tD);

    var tD = document.createElement("td");
    tD.innerHTML = product.name;
    document.getElementById(product.id).appendChild(tD);

    var tD = document.createElement("td");
    tD.innerHTML = product.sub_category;
    document.getElementById(product.id).appendChild(tD);

    var tD = document.createElement("td");
    tD.innerHTML = product.brand;
    document.getElementById(product.id).appendChild(tD);

    var tD = document.createElement("td");
    tD.innerHTML = "Rs. " + product.price;
    document.getElementById(product.id).appendChild(tD);

    var btnEdit = document.createElement("button");
    btnEdit.setAttribute("class", "btn btn-primary");
    btnEdit.setAttribute("id", "btnEdit" + product.id);
    btnEdit.innerHTML = "Edit";
    document.getElementById(product.id).appendChild(btnEdit);

    var btnDel = document.createElement("button");
    btnDel.setAttribute("class", "btn btn-danger");
    btnDel.setAttribute("id", "btnDel" + product.id);
    btnDel.innerHTML = "Remove";
    btnDel.addEventListener("click", () => {
      var id = window.event.target.id + "";
      id = id.slice(-3);
      $.ajax({
        url: restLink + id,
        type: "DELETE",
        success: function(response) {
          window.location = "./admin.html";
        }
      });
    });
    document.getElementById(product.id).appendChild(btnDel);
  }
};

// var productArr = [];
// $(document).ready(function() {
//   $("#searchId").onkeypress(() => {
//     if()
//     var value = document.getElementById("searchId").value;
//     for (var p of allProducts) {
//       if (
//         p.name
//           .toString()
//           .toUpperCase()
//           .indexOf(value.toUpperCase()) !== -1
//       ) {
//         productArr.push(p);
//         console.log(p.id);
//       }
//     }
//     //console.log(productArr);
//     //fillTable(productArr);
//   });
// });

var logOut = function() {
  window.location = "./index.html";
};

var searchItem = function(e) {
  if (e.keyCode == 13) {
    document.getElementById("tData").innerHTML = "";
    var value = document.getElementById("searchId").value;
    var productArr = [];
    for (var p of allProducts) {
      if (
        p.name
          .toString()
          .toUpperCase()
          .indexOf(value.toUpperCase()) !== -1 ||
        p.brand
          .toString()
          .toUpperCase()
          .indexOf(value.toUpperCase()) !== -1 ||
        p.sub_category
          .toString()
          .toUpperCase()
          .indexOf(value.toUpperCase()) !== -1
      ) {
        productArr.push(p);
        //console.log(p.id);
      }
    }
    console.log(productArr);
    fillTable(productArr);
  }
};
