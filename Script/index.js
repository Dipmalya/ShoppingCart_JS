var validateUser = function() {
  var flag = 0;
  var uname = document.getElementById("userName").value;
  var pwd = document.getElementById("password").value;
  $.get("../Data/user.json", function(user, status) {
    for (var i = 0; i < user.length; i++) {
      if (user[i].email == uname && user[i].password == pwd) {
        flag = 1;
        window.location = "./shop.html";
      }
    }
    if (flag == 0)
      document.getElementById("userAuth").innerHTML =
        "Username or Password is invalid";
  });
};
