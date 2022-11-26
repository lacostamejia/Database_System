const container = document.querySelector(".container"),
  pwShowHide = document.querySelectorAll(".showHidePw"),
  pwFields = document.querySelectorAll(".password"),
  signUp = document.querySelector(".signup-link"),
  login = document.querySelector(".login-link");

const urlBase = "https://petrillo.zone/api";
const ext = "php";

// js code to show/hide password and change icon
pwShowHide.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    pwFields.forEach((pwField) => {
      if (pwField.type === "password") {
        pwField.type = "text";

        pwShowHide.forEach((icon) => {
          icon.classList.replace("uil-eye-slash", "uil-eye");
        });
      } else {
        pwField.type = "password";

        pwShowHide.forEach((icon) => {
          icon.classList.replace("uil-eye", "uil-eye-slash");
        });
      }
    });
  });
});

// js code to appear signup and login form
// Login form -> register form
signUp.addEventListener("click", () => {
  container.classList.add("active");
});

// Register form -> login form
login.addEventListener("click", () => {
  container.classList.remove("active");
});

// Login button
function login_function() {
  // Result span for errors
  var result = document.getElementById("login-result");
  result.textContent = "";

  // Get form
  var form = document.getElementById("login-form");
  var data = new FormData(form);

  // Handle form entry
  for (const [key, value] of data) {
    // console.log(`${key}: ${value}`);

    // Trims spaces off front and back of entries
    data[key] = value.trim();

    // Check if entires are empty
    if (value == "") {
      result.textContent = `${key} is empty`;
      return;
    }

    // Checks the email with regex
    if (
      data[key] == data["Email"] &&
      !data["Email"].match(/(.+)@((.+){2,})\.((.+){2,})/)
    ) {
      result.textContent = "Please enter a valid email";
      return;
    }
  }

  // Hash password
  data["Password"] = md5(data["Password"]);

  // Convert to JSON
  const formJson = JSON.stringify(data);
  // console.log(formJson);

  // Handle api call
  var xhr = new XMLHttpRequest();
  url = urlBase + "/login." + ext;
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    // Wait for async return
    xhr.onreadystatechange = function () {
      // Handle the return from api
      if (this.readyState == 4 && this.status == 200) {
        let returnJson = JSON.parse(xhr.responseText);

        // Check for error
        if (returnJson.error !== "") {
          result.textContent = returnJson.error;
          return;
        }

        // Saves the UserID
        UserID = returnJson.UserID;

        if (UserID < 1) {
          result.textContent = "Email/Password combination incorrect";
          return;
        }

        // Saves the users first and last name
        FirstName = returnJson.FirstName;
        LastName = returnJson.LastName;

        // Save cookie using ID, first name, and last name.
        saveCookie();

        // Move to the next html page surveys
        location.href = "survey.html";
      }
    };

    // Send form
    xhr.send(formJson);
  } catch (err) {
    // Display error
    result.textContent = err.message;
  }
}

// Register button
function register_function() {
  // Result span for errors
  var result = document.getElementById("register-result");
  result.textContent = "";

  // Get form
  var form = document.getElementById("register-form");
  var data = new FormData(form);

  // Handle form entry
  for (const [key, value] of data) {
    // console.log(`${key}: ${value}`);

    // Trims spaces off front and back of entries
    data[key] = value.trim();

    // Check if entires are empty
    if (value == "") {
      result.textContent = `${key} is empty`;
      return;
    }

    // Checks the email with regex
    if (
      data[key] == data["Email"] &&
      !data["Email"].match(/(.+)@((.+){2,})\.((.+){2,})/)
    ) {
      result.textContent = "Please enter a valid email";
      return;
    }
  }

  // Make sure passwords are the same then delete second from object
  if (data["Password"] !== data["Confirm Password"]) {
    result.textContent = "Passwords must match";
    return;
  } else {
    delete data["Confirm Password"];
  }

  // Hash password
  data["Password"] = md5(data["Password"]);

  // Convert to JSON
  const formJson = JSON.stringify(data);
  // console.log(formJson);

  // Handle api call
  var xhr = new XMLHttpRequest();
  url = urlBase + "/register." + ext;
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    // Wait for async return
    xhr.onreadystatechange = function () {
      // Handle the return from api
      if (this.readyState == 4 && this.status == 200) {
        let returnJson = JSON.parse(xhr.responseText);

        // Check for error
        if (returnJson.error !== "") {
          result.textContent = returnJson.error;
          return;
        }

        // Saves the UserID
        UserID = returnJson.UserID;
        FirstName = returnJson.FirstName;
        LastName = returnJson.LastName;

        // Save cookie using ID, first name, and last name.
        saveCookie();

        // Move to the next html page surveys
        location.href = "survey.html";
      }
    };

    // Send form
    xhr.send(formJson);
  } catch (err) {
    // Display error
    result.textContent = err.message;
  }
}

// Save a cookie with UserID, FirstName, LastName
function saveCookie() {
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie = "UserID=" + UserID + ",FirstName=" + FirstName + ",LastName=" + LastName + ";expires=" + date.toGMTString();
}
