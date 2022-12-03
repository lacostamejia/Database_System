// Url constants
const urlBase = "https://petrillo.zone/api";
const ext = "php";

document.addEventListener("DOMContentLoaded", function () {
    welcome_function();
    createdSurveys();
});

function welcome_function() {
    var username = document.getElementById("user name");
    username.textContent = "";

    // Makes sure UserID exists thus cookie exists
    if (document.cookie != "" && readCookieAttr("UserID") > 0) {
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

// Return the cookie as an object
function cookieToObject() {

    const result = {}

    var str = document.cookie;
    str = str.split(',');
    for (let i in str) {
        const cur = str[i].split('=');
        result[cur[0]] = cur[1];
    }

    return result;
}

// Update the cookie's expiration time
function updateCookie() {
    var cookie = document.cookie;
}

// Gets and creates a table of user created surveys
function createdSurveys() {

    // Get the div to create the list
    var createdSurvey = document.getElementById("created-surveys");

    // Result span for errors
    var result = document.createElement('span');
    result.setAttribute('id', 'created-survey-error');
    result.classList.add("invalid");
    result.textContent = "";
    createdSurvey.appendChild(result);

    // Convert to JSON
    const sendJson = JSON.stringify(cookieToObject());
    // console.log(sendJson);

    // Handle api call
    var xhr = new XMLHttpRequest();
    url = urlBase + "/getCreatedSurvey." + ext;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        // Wait for async return
        xhr.onreadystatechange = function () {
            // Handle the return from api
            if (this.readyState == 4 && this.status == 200) {
                // Have to double parse the response to ensure response is turned into object
                let returnJson = JSON.parse(JSON.parse(xhr.responseText));
                // console.log(returnJson);

                // Check for error
                if (returnJson.error !== "" && returnJson.error !== "No Records Found") {
                    result.textContent = returnJson.error;
                    return;
                }

                // Turn the returned json to table
                const table = document.createElement('table');
                table.classList.add('survey-table');
                createdSurvey.appendChild(table);

                // Append the row
                var row = document.createElement('tr');
                table.appendChild(row);

                // Append each column
                let cell = document.createElement('td');
                cell.textContent = "Title";
                row.appendChild(cell);
                cell = document.createElement('td');
                cell.textContent = "Description";
                row.appendChild(cell);
                cell = document.createElement('td');
                cell.textContent = "Start Date";
                row.appendChild(cell);
                cell = document.createElement('td');
                cell.textContent = "End Date";
                row.appendChild(cell);
                cell = document.createElement('td');
                cell.textContent = "# Type1";
                row.appendChild(cell);
                cell = document.createElement('td');
                cell.textContent = "# Type2";
                row.appendChild(cell);
                cell = document.createElement('td');
                cell.textContent = "Delete Survey";
                row.appendChild(cell);

                returnJson.Surveys.forEach(element => {
                    // console.log(element);
                    let row = document.createElement('tr');
                    row.id = `SurveyID=${element.SurveyID}`;
                    table.appendChild(row);

                    for (const [key, value] of Object.entries(element)) {
                        // console.log(`${key}: ${value}`);

                        if (key === "SurveyID") {
                            let btn = document.createElement('input');
                            btn.type = "button";
                            btn.className = "del-button";
                            btn.value = "Delete";
                            btn.onclick = function () { delete_Survey(value) };
                            row.appendChild(btn);
                            continue;
                        }

                        let cell = document.createElement('td');
                        cell.textContent = value;
                        row.appendChild(cell);
                    }
                });

                // Update cookie expiration time
                updateCookie();
            }
        };

        // Send Json
        xhr.send(sendJson);
    } catch (err) {
        // Display error
        result.textContent = err.message;
    }
}

function delete_Survey(val) {
    // console.log(val);

    // Warn user that delete will be irreversable
    if (confirm("Are you sure you want to delete this survey?\nThis will delete all records and results.") == false) {
        return;
    }

    // Result span for errors
    var result = document.getElementById('created-survey-error');
    result.textContent = "";

    // Convert to JSON
    const sendJson = JSON.stringify({ "SurveyID": val});
    console.log(sendJson);

    // Handle api call
    var xhr = new XMLHttpRequest();
    url = urlBase + "/deleteCreatedSurvey." + ext;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        // Wait for async return
        xhr.onreadystatechange = function () {
            // Handle the return from api
            if (this.readyState == 4 && this.status == 200) {
                // Have to double parse the response to ensure response is turned into object
                let returnJson = JSON.parse(xhr.responseText);
                console.log(returnJson);

                // Check for error
                if (returnJson.error !== "") {
                    result.textContent = returnJson.error;
                    return;
                }

                // Get row from id
                const rowID = document.getElementById(`SurveyID=${val}`);
                rowID.remove();

                // Update cookie expiration time
                updateCookie();
            }
        };

        // Send Json
        xhr.send(sendJson);
    } catch (err) {
        // Display error
        result.textContent = err.message;
    }
}
