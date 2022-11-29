// Url constants
const urlBase = "https://petrillo.zone/api";
const ext = "php";

document.addEventListener("DOMContentLoaded", function () {
    welcome_function();
});

function welcome_function() {
    var username = document.getElementById("user name");
    username.textContent = "";

    // Makes sure UserID exists thus cookie exists
    if (readCookieAttr("UserID") !== 0) {
        username.textContent = `Welcome, ${readCookieAttr('FirstName')} ${readCookieAttr('LastName')}`;
    }
}

function logout() {
    // Delete cookie
    document.cookie = "UserID=;expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    location.href = "index.html";
}

// Returns the cookies attribute: UserID, FirstName, or LastName
function readCookieAttr(attribute) {
    return document.cookie
        .split(',')
        .find((row) => row.startsWith(`${attribute}=`))
        ?.split('=')[1];
} 
