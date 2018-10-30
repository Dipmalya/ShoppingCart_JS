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
    btnEdit.setAttribute("data-toggle", "modal");
    btnEdit.setAttribute("data-target", "#myModal2");
    btnEdit.addEventListener("click", e => {
      var objId = e.target.id.slice(-3);
      document.getElementById("modalData2").innerHTML = "";
      fillEditData(objId);
    });
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

var fillEditData = function(id) {
  console.log(id);

  for (var p of allProducts) {
    if (p.id == id) {
      var i = 1;
      for (var val in p) {
        if (p.hasOwnProperty(val) && val != "image") {
          var tabRow = document.createElement("tr");
          tabRow.setAttribute("id", "row" + i);
          document.getElementById("modalData2").appendChild(tabRow);

          var tabDataKey = document.createElement("td");
          tabDataKey.setAttribute("id", "key" + i);
          tabDataKey.innerHTML = val;
          document.getElementById("row" + i).appendChild(tabDataKey);

          var tabDataVal = document.createElement("td");
          tabDataVal.setAttribute("id", "val" + i);
          document.getElementById("row" + i).appendChild(tabDataVal);

          var textField = document.createElement("input");
          textField.setAttribute("type", "text");
          textField.id = "input" + i;
          textField.value = p[val];
          document.getElementById("val" + i).appendChild(textField);
        }
        i++;
      }
    }
  }
};

var addProduct = function() {
  document.getElementById("modalData").innerHTML = "";
  var defaultProduct = [
    "",
    "name",
    "category",
    "sub_category",
    "brand",
    "price"
  ];
  for (var i = 1; i <= 5; i++) {
    var tabRow = document.createElement("tr");
    tabRow.setAttribute("id", "row" + i);
    document.getElementById("modalData").appendChild(tabRow);

    var tabDataKey = document.createElement("td");
    tabDataKey.setAttribute("id", "key" + i);
    document.getElementById("row" + i).appendChild(tabDataKey);

    var tabDataVal = document.createElement("td");
    tabDataVal.setAttribute("id", "val" + i);
    document.getElementById("row" + i).appendChild(tabDataVal);

    var textFieldKey = document.createElement("h5");
    textFieldKey.id = "inputKey" + i;
    textFieldKey.innerHTML = defaultProduct[i];
    document.getElementById("key" + i).appendChild(textFieldKey);

    var textFieldVal = document.createElement("input");
    textFieldVal.setAttribute("type", "text");
    textFieldVal.id = "inputVal" + i;
    document.getElementById("val" + i).appendChild(textFieldVal);
  }
};

var addDetails = function() {
  var addObj = {
    id: "0" + (eval(allProducts.length) + 1)
  };
  for (var i = 1; i <= 5; i++) {
    addObj[
      document.getElementById("inputKey" + i).innerHTML + ""
    ] = document.getElementById("inputVal" + i).value;
  }
  console.log(addObj);

  $.ajax({
    type: "POST",
    url: "localhost:4010/rest/api/post",
    crossDomain: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "*"
    },
    data: addObj,
    dataType: "json",
    success: function(resultData) {
      location.reload();
    }
  });
};

var saveDetails = function() {
  var rows = document.getElementById("modalData2").childElementCount;
  var updateObj = {};
  for (var i = 1; i < rows; i++) {
    if (document.getElementById("key" + i) == undefined) continue;
    updateObj[
      document.getElementById("key" + i).innerHTML + ""
    ] = document.getElementById("input" + i).value;
    //console.log(document.getElementById("key" + i).innerHTML);
  }
  console.log(updateObj);
  $.ajax({
    type: "PUT",
    url:
      "localhost:4010/rest/api/update/" +
      document.getElementById("input1").value,
    crossDomain: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "*"
    },
    data: updateObj,
    dataType: "json",
    success: function(resultData) {
      location.reload();
    }
  });
};
