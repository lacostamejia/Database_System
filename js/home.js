// Url constants
const urlBase = "https://petrillo.zone/api";
const ext = "php";

// Functions to run on page load
document.addEventListener("DOMContentLoaded", function () {
    welcome_function();
    createdSurveys();
    participateSurvey();
    showSurveyResults();
});

// Function to get the users' name and display it
function welcome_function() {
    var username = document.getElementById("user name");
    username.textContent = "";

    // Makes sure UserID exists thus cookie exists
    if (document.cookie != "" && readCookieAttr("UserID") > 0) {
        username.textContent = `Welcome, ${readCookieAttr('FirstName')} ${readCookieAttr('LastName')}`;
    }
}

// Logout to return to main and delete cookie
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
                if ((returnJson.error !== "" && returnJson.error !== "No Records Found") || returnJson.Surveys == null) {
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
    // console.log(sendJson);

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
                // console.log(returnJson);

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

// Gets and creates a table of user created surveys
function participateSurvey() {

    // Get the div to create the list
    var createdSurvey = document.getElementById("assigned-surveys");

    // Result span for errors
    var result = document.createElement('span');
    result.setAttribute('id', 'assigned-survey-error');
    result.classList.add("invalid");
    result.textContent = "";
    createdSurvey.appendChild(result);

    // Convert to JSON
    const sendJson = JSON.stringify({ "UserID": readCookieAttr("UserID")});
    // console.log(sendJson);

    // Handle api call
    var xhr = new XMLHttpRequest();
    url = urlBase + "/getAssignedSurvey." + ext;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        // Wait for async return
        xhr.onreadystatechange = function () {
            // Handle the return from api
            if (this.readyState == 4 && this.status == 200) {
                // Parse returned json
                let returnJson = JSON.parse(JSON.parse(xhr.responseText));
                // console.log(returnJson);

                // Check for error
                if ((returnJson.error !== "" && returnJson.error === "No Assigned Surveys") || returnJson.Surveys == null) {
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
                cell.textContent = "Take Survey";
                row.appendChild(cell);

                returnJson.Surveys.forEach(element => {
                    // console.log(element);
                    let row = document.createElement('tr');
                    row.id = `SurveyID=${element.SurveyID}`;
                    table.appendChild(row);

                    // Get the dates to see if surveys can be taken
                    let surveyEnd = element.EndDate;
                    let surveyStart = element.StartDate;

                    // Get the current date and convert to eastern time, then split to only get dates and not time
                    let todaysDate = new Date().toLocaleString("en-US", {timeZone: "America/New_York"}).split(',')[0];
                    
                    // Destructure into month, day and year
                    let [month, day, year] = todaysDate.split('/');

                    // Fix the month and day values to make sure they have leading 0s if less than 10
                    month = (month < 10) ? `0${month}` : month;
                    day = (day < 10) ? `0${day}` : day;

                    // Set todays date in format that is comparable with incoming date
                    todaysDate = `${year}-${month}-${day}`;

                    for (const [key, value] of Object.entries(element)) {
                        // console.log(`${key}: ${value}`);
                        if (key === "SurveyID") {
                            let btn = document.createElement('input');
                            btn.type = "button";
                            btn.className = "take-survey-button";
                            btn.value = "Take";
                            // Set the button to allow the survey or not allow based on date
                            if (todaysDate <= surveyEnd && todaysDate >= surveyStart) {
                                btn.onclick = function() {window.location.href = "takeSurvey.html?SurveyID=" + value};
                            } else {
                                btn.onclick = function() {alert("You cannot take this survey it is outside the start or end date.")};
                            }

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

// Display the results of completed surveys
function showSurveyResults() {
    
    // Get the div to create the list
    var resultSurvey = document.getElementById("completed-surveys");

    // Result span for errors
    var result = document.createElement('span');
    result.setAttribute('id', 'result-survey-error');
    result.classList.add("invalid");
    result.textContent = "";
    resultSurvey.appendChild(result);

    // Convert to JSON
    const sendJson = JSON.stringify({ "UserID": readCookieAttr("UserID")});
    // console.log(sendJson);

    // Handle api call
    var xhr = new XMLHttpRequest();
    url = urlBase + "/surveyresults." + ext;
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
                if ((returnJson.error !== "" && returnJson.error !== "Could Not Get Survey Results") || returnJson.Surveys == null) {
                    result.textContent = returnJson.error;
                    return;
                }

                // Turn the returned json to table
                const table = document.createElement('table');
                table.classList.add('result-table');
                resultSurvey.appendChild(table);

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
                cell.textContent = "Go To Results";
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
                            btn.className = "result-button";
                            btn.value = "Result";
                            btn.onclick = function() {window.location.href = "surveyresults.html?SurveyID=" + value};
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
