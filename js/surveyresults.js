const urlBase = "https://petrillo.zone/api";
const ext = "php";


const name_survey = document.getElementById("title");
const table = document.getElementById("table_results");
const table_body = document.getElementById("table_body");
const questions = ["test1","test2"];
const answers =  ["a1","a2"];

var surveyid = new URLSearchParams(window.location.search).get('SurveyID');

window.onload = changeName();

function changeName(){
    obtainResults();
}

//Pass the survey ID
function getSelectedSurvey(x){
    obtainResults(x);
}

function download(filename) {

    var holder = "Questions: ";
    var holder_2 = "Answers: ";

    var questions_text = "";
    var answers_text = "";
    for(var i = 0; i < questions.length; i++){
        var questions_text = questions_text +" " + questions[i];
    }
    for(var i = 0; i < answers.length; i++){
        var answers_text = answers_text +" " + answers[i];
    }

    var final_text = holder + questions_text + "\n" + holder_2 + answers_text;

    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(final_text));
    element.setAttribute('download', filename);


    element.style.display = 'none';

    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

    Console.log(questions_text);
  }

function obtainResults(questions,results){
    
    test = {SurveyID: surveyid};

    const sendJson = JSON.stringify(test);

    var xhr = new XMLHttpRequest();
    url = urlBase + "/getSurveyResults." + ext;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        // Wait for async return
        xhr.onreadystatechange = function () {
            // Handle the return from api
            if (this.readyState == 4 && this.status == 200) {
                // Have to double parse the response to ensure response is turned into object
                let returnJson = JSON.parse(xhr.responseText);
                var x = []
                var y = []
                document.getElementById("title").innerText = returnJson.Surveys[0].Title;
                    //Call API to obtain the values of X and Y and then pass them

                 var tr_questions = table.insertRow(); // Insert first row of all questions.


                var i = 0;
                //Questions
                     for(const key in returnJson.Surveys[0]){
                        if(returnJson.Surveys[0][key] !== null && key !== "NumType1" && key !== "NumType2" && key !== "Title" & key !== "Description" && !key.includes("A") ){
                            x[i] = returnJson.Surveys[0][key];
                            i++;
                        }
                     }
                     createQuestions(x, tr_questions);
                    i = 0;
                
        
                for(var j = 0; j < returnJson.Surveys.length; j++){
                    var tr_answers = table.insertRow(); // Insert first row of all questions
                    var t = 0;
                    //Answers
                     for(const key in returnJson.Surveys[j]){
                        if(returnJson.Surveys[j][key] !== null && key !== "NumType1" && key !== "NumType2" && key !== "Title" & key !== "Description" && !key.includes("Q")){
                            y[t] = returnJson.Surveys[j][key];
                            t++;
                        }
                     }
                     console.log(y);
                     createAnswers(y,tr_answers)

                y = [];

                }
                
                //Get the survey ID and store it to later assign

            }
        };
        xhr.send(sendJson);
    } catch (err) {
        // Display error
       console.log(err);
    }



}
function createQuestions(x,tr_questions){
    for (let j = 0; j < x.length; j++) {
        const td = tr_questions.insertCell();
        td.appendChild(document.createTextNode(x[j]));
        td.style.border = '1px solid black';
      }

}
function createAnswers(x,tr_answers){

    for (let j = 0; j < x.length; j++) {
      const td = tr_answers.insertCell();
      td.appendChild(document.createTextNode(x[j]));
      td.style.border = '1px solid black';
    }

}
