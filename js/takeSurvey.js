// Url constants
const urlBase = "https://petrillo.zone/api";
const ext = "php";

// Functions to run on page load
document.addEventListener("DOMContentLoaded", function () {
    create_survey();
});

// Update the cookie's expiration time
function updateCookie() {
    var cookie = document.cookie;
}

// Returns the cookies attribute: UserID, FirstName, or LastName
function readCookieAttr(attribute) {
    return document.cookie
        .split(',')
        .find((row) => row.startsWith(`${attribute}=`))
        ?.split('=')[1];
}

function create_survey() {
    // Get the survey id from the url that is passed and userid from cookie
    var SurveyID = new URLSearchParams(window.location.search).get('SurveyID');
    var UserID = readCookieAttr("UserID");

    // Get the survey title
    var surveyWrapper = document.getElementById("creation_wrapper");

    // Result span for errors
    var result = document.createElement('span');
    result.setAttribute('id', 'survey-error');
    result.classList.add("invalid");
    result.textContent = "";
    surveyWrapper.appendChild(result);

    // Convert to JSON
    const sendJson = JSON.stringify({ "SurveyID": SurveyID, "UserID": UserID });
    // console.log(sendJson);

    // Handle api call
    var xhr = new XMLHttpRequest();
    url = urlBase + "/getSurvey." + ext;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        // Wait for async return
        xhr.onreadystatechange = function () {
            // Handle the return from api
            if (this.readyState == 4 && this.status == 200) {
                // Parse the response
                let returnJson = JSON.parse(xhr.responseText);
                console.log(returnJson);

                // Check for error
                if (returnJson.error !== "" && returnJson.error !== "Could Not Get Survey") {
                    result.textContent = returnJson.error;
                    return;
                }

                // Turn the returned json to survey

                // Write the title
                const surveyTitle = document.getElementById("survey-title");
                surveyTitle.textContent = returnJson.Title;

                // Write the description
                const surveyDescription = document.getElementById("survey-description");
                surveyDescription.textContent = returnJson.Description;

                // Get a temp date for start
                var tmpDate = new Date(returnJson.StartDate);

                // Write the start date
                const startDate = document.getElementById("start-date");
                startDate.textContent = `${tmpDate.getDay()}/${tmpDate.getMonth()}/${tmpDate.getFullYear()}`;

                // Get end date
                tmpDate = new Date(returnJson.EndDate);

                // Write the end date
                const endDate = document.getElementById("end-date");
                endDate.textContent = `${tmpDate.getDay()}/${tmpDate.getMonth()}/${tmpDate.getFullYear()}`;


                // Get the survey form element
                const surveyForm = document.getElementById("survey-form");

                if (returnJson.NumType1 > 0) {
                    const type1Questions = document.getElementById("type-1-questions");

                    // Loop through the number of times to create type 1 questions
                    for (let i = 1; i <= returnJson.NumType1; i++) {
                        create_type_1_question(type1Questions, returnJson, i);
                    }
                }

                if (returnJson.NumType2 > 0) {
                    const type2Questions = document.getElementById("type-2-questions");

                    // Loop through the number of times to create type 2 questions
                    for (let i = 1; i <= returnJson.NumType2; i++) {
                        create_type_2_question(type2Questions, returnJson, i);
                    }
                }

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

// Create type 1 question
function create_type_1_question(parentElement, json, qnum) {

    // Create the div for question type 1
    const question = document.createElement('div');
    question.setAttribute('id', `type-1-question-${qnum}`);
    parentElement.appendChild(question);

    // Create the label for question
    const questionLabel = document.createElement('label');
    questionLabel.textContent = json[`Type1Q${qnum}`];
    question.appendChild(questionLabel);
    var breakpoint = document.createElement('br');
    question.appendChild(breakpoint);

    var checkedAnswer = json[`Type1A${qnum}`];

    // Create the radio buttons
    for (let i = 1; i <= 5; i++) {
        // Create the label for question
        const radioButton = document.createElement('input');
        radioButton.setAttribute('type', 'radio');
        radioButton.setAttribute('id', `type-1-question-${qnum}-${i}`);
        radioButton.setAttribute('value', `${i}`);
        radioButton.setAttribute('name', `type-1-question-${qnum}`);

        if (i == checkedAnswer) {
            radioButton.checked = true;
        }

        question.appendChild(radioButton);

        const radioLabel = document.createElement('label');
        radioLabel.setAttribute('for', `${i}`);
        radioLabel.textContent = ` ${i}`;
        question.appendChild(radioLabel);
        var breakpoint = document.createElement('br');
        radioLabel.appendChild(breakpoint);
    }

    var breakpoint = document.createElement('br');
    question.appendChild(breakpoint);
}

// Create type 2 question
function create_type_2_question(parentElement, json, qnum) {

    // Create the div for question type 2
    const question = document.createElement('div');
    question.setAttribute('id', `type-2-question-${qnum}-wrap`);
    parentElement.appendChild(question);

    // Create the label for question
    const questionLabel = document.createElement('label');
    questionLabel.textContent = json[`Type2Q${qnum}`];
    question.appendChild(questionLabel);
    var breakpoint = document.createElement('br');
    question.appendChild(breakpoint);

    // Create the text area
    const questionText = document.createElement('textarea');
    questionText.setAttribute('id', `type-2-question-${qnum}`);
    questionText.setAttribute('name', `type-2-question-${qnum}`);
    questionText.setAttribute('rows', '4');
    questionText.setAttribute('cols', '100');
    questionText.textContent = json[`Type2A${qnum}`];
    question.appendChild(questionText);
    var breakpoint = document.createElement('br');
    question.appendChild(breakpoint);

    // Create the word count
    const wordCount = document.createElement('span');
    wordCount.setAttribute('id', `question-${qnum}-word-count`);
    wordCount.style.fontSize = 'smaller';
    wordCount.textContent = '200';
    question.appendChild(wordCount);
    var breakpoint = document.createElement('br');
    question.appendChild(breakpoint);
    var breakpoint = document.createElement('br');
    question.appendChild(breakpoint);

    // Add the function to count words passing the span element and text area
    questionText.oninput = function () { count_words(questionText, wordCount) };
}

// Update the word count of the text area
function count_words(textAreaElement, numWordsElement) {

    var count = 0;

    // Split the text on space
    var split = textAreaElement.value.split(' ');

    // Count the number of words
    for (var i = 0; i < split.length; i++) {
        if (split[i] != "") {
            count += 1;
        }
    }

    var finalCount = 200 - count;

    // Update the output
    if (finalCount < 0) {
        numWordsElement.textContent = 'Max Word Limit Reached';
        numWordsElement.classList.add('invalid');
    } else {
        numWordsElement.textContent = finalCount;
        numWordsElement.classList.remove('invalid');
    }
}

// Save survey function
function save_survey() {

    // Get the survey id from the url that is passed and userid from cookie
    var SurveyID = new URLSearchParams(window.location.search).get('SurveyID');
    var UserID = readCookieAttr("UserID");

    var dataToSend = { "SurveyID": SurveyID, "UserID": UserID };

    const numType1 = document.getElementById('type-1-questions').childElementCount;
    // Loop through the number of type 1 questions and get their result
    for (let i = 1; i <= numType1; i++) {
        dataToSend[`Type1A${i}`] = getQuestionType1Result(document.getElementsByName(`type-1-question-${i}`));
        // console.log(getQuestionType1Result(document.getElementsByName(`type-1-question-${i}`)));
    }

    const numType2 = document.getElementById('type-2-questions').childElementCount

    // Loop through the nuber of type 2 questions and get their result
    for (let i = 1; i <= numType2; i++) {
        var textAnswer = document.getElementById(`type-2-question-${i}`).value;
        if (textAnswer === '') {
            dataToSend[`Type2A${i}`] = null;
        }
        else {
            dataToSend[`Type2A${i}`] = textAnswer;
        }
        // console.log(document.getElementById(`type-2-question-${i}`).value);
    }

    // Result span for errors
    var result = document.getElementById('survey-error');
    result.textContent = "";

    // Convert to JSON
    const sendJson = JSON.stringify(dataToSend);
    // console.log(sendJson);

    // Handle api call
    var xhr = new XMLHttpRequest();
    url = urlBase + "/saveSurvey." + ext;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        // Wait for async return
        xhr.onreadystatechange = function () {
            // Handle the return from api
            if (this.readyState == 4 && this.status == 200) {
                // Parse the response
                let returnJson = JSON.parse(xhr.responseText);
                // console.log(returnJson);

                // Check for error
                if (returnJson.error !== "" && returnJson.error !== "Could Not Save Survey") {
                    result.textContent = returnJson.error;
                    return;
                }

                // Update cookie expiration time
                updateCookie();

                // Move back to homepage
                location.href = "home.html";
            }
        };

        // Send Json
        xhr.send(sendJson);
    } catch (err) {
        // Display error
        result.textContent = err.message;
    }
}

// Get the type 1 question result or return null
function getQuestionType1Result(elements) {
    for (i = 0; i < elements.length; i++) {
        if (elements[i].checked) {
            return elements[i].value;
        }
    }
    return null;
}

// Submit survey function
function submit_survey() {
    // Warn user that submit will be irreversable
    if (confirm("Are you sure you want to submit this survey?\nYou will not be able to edit your answers after submitting.") == false) {
        return;
    }

    // Get the survey id from the url that is passed and userid from cookie
    var SurveyID = new URLSearchParams(window.location.search).get('SurveyID');
    var UserID = readCookieAttr("UserID");

    var dataToSend = { "SurveyID": SurveyID, "UserID": UserID };

    const numType1 = document.getElementById('type-1-questions').childElementCount;
    // Loop through the number of type 1 questions and get their result
    for (let i = 1; i <= numType1; i++) {
        dataToSend[`Type1A${i}`] = getQuestionType1Result(document.getElementsByName(`type-1-question-${i}`));
        // console.log(getQuestionType1Result(document.getElementsByName(`type-1-question-${i}`)));
    }

    const numType2 = document.getElementById('type-2-questions').childElementCount

    // Loop through the nuber of type 2 questions and get their result
    for (let i = 1; i <= numType2; i++) {
        var textAnswer = document.getElementById(`type-2-question-${i}`).value;
        if (textAnswer === '') {
            dataToSend[`Type2A${i}`] = null;
        }
        else {
            dataToSend[`Type2A${i}`] = textAnswer;
        }
        // console.log(document.getElementById(`type-2-question-${i}`).value);
    }

    // Result span for errors
    var result = document.getElementById('survey-error');
    result.textContent = "";

    // Convert to JSON
    const sendJson = JSON.stringify(dataToSend);
    // console.log(sendJson);

    // Handle api call
    var xhr = new XMLHttpRequest();
    url = urlBase + "/submitSurvey." + ext;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        // Wait for async return
        xhr.onreadystatechange = function () {
            // Handle the return from api
            if (this.readyState == 4 && this.status == 200) {
                // Parse the response
                let returnJson = JSON.parse(xhr.responseText);
                // console.log(returnJson);

                // Check for error
                if (returnJson.error !== "" && returnJson.error !== "Could Not Submit Survey") {
                    result.textContent = returnJson.error;
                    return;
                }

                // Update cookie expiration time
                updateCookie();

                // Move back to homepage
                location.href = "home.html";
            }
        };

        // Send Json
        xhr.send(sendJson);
    } catch (err) {
        // Display error
        result.textContent = err.message;
    }
}
