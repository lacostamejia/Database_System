const container = document.querySelector(".container"),
  pwShowHide = document.querySelectorAll(".showHidePw"),
  pwFields = document.querySelectorAll(".password"),
  signUp = document.querySelector(".signup-link"),
  login = document.querySelector(".login-link");

const urlBase = "http://petrillo.zone/api";
const ext = "php";

// js code to show/hide password and change icon
pwShowHide.forEach(eyeIcon => {
  eyeIcon.addEventListener("click", () => {
    pwFields.forEach(pwField => {
      if (pwField.type === "password") {
        pwField.type = "text";

        pwShowHide.forEach(icon => {
          icon.classList.replace("uil-eye-slash", "uil-eye");
        })
      } else {
        pwField.type = "password";

        pwShowHide.forEach(icon => {
          icon.classList.replace("uil-eye", "uil-eye-slash");
        })
      }
    })
  })
})

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
  var result = document.getElementById('login-result');
  result.textContent = '';

  // Get form
  var form = document.getElementById('login-form');
  var data = new FormData(form);
  
  // Handle form entry
  for (const [key, value] of data) {
    // console.log(`${key}: ${value}`);

    // Trims spaces off front and back of entries
    data[key] = value.trim();

    // Check if entires are empty
    if (value == '') {
      result.textContent = `${key} is empty`;
      return;
    }

    // Checks the email with regex
    if (data[key] == data['Email'] && !data['Email'].match(/(.+)@((.+){2,})\.((.+){2,})/)) {
      result.textContent = 'Please enter a valid email';
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
  url = urlBase + '/login.' + ext;
  xhr.open('POST', url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {

    // Wait for async return
    xhr.onreadystatechange = function() {
      // Handle the return from api
      console.log('something happened')
      console.log(this.readyState);
      console.log(this.status)
    }

    // Send form
    xhr.send(formJson);
  }
  catch (err) {
    // Display error
    result.textContent = err.message;
  }
  // Move to the 
  // location.href = 'survey.html';
}
