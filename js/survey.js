
const urlBase = "https://petrillo.zone/api";
const ext = "php";


//Setting up questions that will be displayed depending if the selection was made or not
const first = document.getElementById("first")
const second = document.getElementById("second");

const name_survey = document.getElementById("name_survey");
const description_survey = document.getElementById("description_survey");
const endate = document.getElementById("end_date");
const startdate = document.getElementById("start_date");


const first_number = document.getElementById("NumType1");
const second_number = document.getElementById("NumType2");

const all_questions_1 = [];
const all_questions_2 = [];
//let total_emails = 0;

const emails = [];
const emails_checked = [];



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


function Next(){

    var today = new Date();

    var dd = today.getDate();

    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    }

    var today_formated = yyyy + "-" + mm + "-" + dd;


    if(name_survey.value == ""){
        document.getElementById("name_survey").style.borderColor = "red";
        alert("No name");
        return;
    }
    else{
        document.getElementById("name_survey").style.borderColor = "green";
    }

    if(startdate.value > endate.value){
        alert("Error, the start date can't be after the end date")
        document.getElementById("start_date").style.borderColor = "red";
        return;
    }
    else{
        document.getElementById("start_date").style.borderColor = "green";
    }
    if(startdate.value < today_formated){
        alert("Error, the start date can't be in the past")
        document.getElementById("start_date").style.borderColor = "red";
        return;
    }
    else{
        document.getElementById("start_date").style.borderColor = "green";
    }

    if(endate < today_formated){
        alert("Error, the end date can't be in the past")
        document.getElementById("end_date").style.borderColor = "red";
        return;
    }
    else{
        document.getElementById("end_date").style.borderColor = "green";
    }
    if(description_survey.value == ""){
        alert("Description is required");
        document.getElementById("description_survey").style.borderColor = "red";
        return;
    }
    else{
        document.getElementById("description_survey").style.borderColor = "green";
    }

    //Create a if not type of questions where chose


    if(first_number.value < 1 && first.style.display === "block"){
        alert("The number of questions need to be larger than 1");
        document.getElementById("NumType1").style.borderColor = "red";
        return;
    }
    else{
        document.getElementById("NumType1").style.borderColor = "green";
    }
    if(second_number.value < 1 && second.style.display === "block"){
        alert("The number of questions need to be larger than 1");
        document.getElementById("NumType2").style.borderColor = "red";
        return;
     
    }
    else{
        document.getElementById("NumType2").style.borderColor = "green";
    }
    askquestions(first_number.value,second_number.value);


    //TEST send email

};


function askquestions(x, y){

    document.getElementById("creation_wrapper").style.display = "none";
    document.getElementById("questions_wrapper").style.display = "block";

    //Question 1
    if(x !== null && x !== ""){
        document.getElementById("divfirstquestions").style.display = "block";
        var inputContainer = document.getElementById("divfirstquestions");

        var p1 = document.createElement('p');
        p1.innerHTML = "Questions (1)";
        inputContainer.appendChild(p1);

        for(var i = 0; i < x; i++){
            var newForm = document.createElement("input");
            newForm.setAttribute("type", "text");
            newForm.setAttribute("id", "Type1Q"+i+1);
            newForm.setAttribute('size','40');
            inputContainer.appendChild(newForm);
            inputContainer.appendChild(document.createElement("br"));
            inputContainer.appendChild(document.createElement("br"));
        }
        first_choice();
    }


    if(y !== "" && y !== null){
        document.getElementById("divsecondquestions").style.display = "block";
        var inputContainer_2 = document.getElementById("divsecondquestions");

        var p2 = document.createElement('p');
        p2.innerHTML = "Questions (2)";

        inputContainer_2.appendChild(p2);


        for(var i = 0; i < y; i++){
            var newForm_2 = document.createElement("input");
            newForm_2.setAttribute("type", "text");
            newForm_2.setAttribute("id", "Type2Q"+i+1);
            newForm_2.setAttribute('size','40');
            inputContainer_2.appendChild(newForm_2);
            inputContainer_2.appendChild(document.createElement("br"));
            inputContainer_2.appendChild(document.createElement("br"));
        }
        second_choice();
    }


};

function Next_2(){

    for (var x = 0; x < first_number.value; x++){
        all_questions_1[x] = document.getElementById("Type1Q"+x+1).value;
    }

    for (var x = 0; x < second_number.value; x++){
        all_questions_2[x] = document.getElementById("Type2Q"+x+1).value;
    }

    //console.log(all_questions_1);
   // console.log(all_questions_2);

    //Travel for loop TYPE1Q AND TYPE2Q to store in list their values.
  

    document.getElementById("questions_wrapper").style.display = "none";
    document.getElementById("assignto_wrapper").style.display = "block";

    //Call PHP to show all users and pass it as parameter for display_users_emails

       // Handle api call

       let tmp = {};

       const sendJson = JSON.stringify(tmp);
       var xhr = new XMLHttpRequest();
       url = urlBase + "/getAllUserEmail." + ext;
       xhr.open("POST", url, true);
       xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
       try {
           // Wait for async return
           xhr.onreadystatechange = function () {
               // Handle the return from api
               if (this.readyState == 4 && this.status == 200) {
                   // Have to double parse the response to ensure response is turned into object
                   let returnJson = JSON.parse(xhr.responseText);
                   //total_emails = returnJson.Emails.length; //Set the total amount of emails.
                   for(var x = 0; x < returnJson.Emails.length; x++){
                    emails[x] = returnJson.Emails[x];
                   }
                   display_users_emails(emails);
                   // Check for error
                   if (returnJson.error !== "" && returnJson.error !== "No Records Found") {
                       console.log(returnJson.error);
                       return;
                   }
   
               }
           };
           xhr.send(sendJson);
       } catch (err) {
           // Display error
          console.log(err);
       }


}


function create(){
    
    document.getElementById("creation_wrapper").style.display = "block";
    document.getElementById("assignto_wrapper").style.display = "none";

    var surveyID = 0;

    var z = 0;



    for(var i = 0; i < emails.length; i++){
        if(document.getElementById("check" + i).checked){
            emails_checked[z] = emails[i]; 
            z++;
        }
    }


   // console.log(emails_checked.length);
    //console.log(emails.length);

   

    if(first_number.value < 1){
        first_number.value = 0;
    }
    if(second_number.value < 1 ){
        second_number.value = 0;
    }

    //Create survey PHP

    //Get a function to get the current date:

    //console.log(readCookieAttr('UserID'));

    var test = {CreatorID: readCookieAttr('UserID'), Title : name_survey.value, Description : description_survey.value , StartDate : startdate.value , EndDate : endate.value , NumType1 : first_number.value , NumType2 : second_number.value};

    var obs = new Array();
    var questions1 = "";
    var questions2 = "";

    for(var x = 0; x < all_questions_1.length; x++){
        questions1 += "Type1Q" + (x + 1) + ":" + all_questions_1[x] + ",";
    }
    questions1 = questions1.substring(0,questions1.length - 1);

    for(var x = 0; x < all_questions_2.length; x++){
        questions2 += "Type2Q" + (x + 1) + ":" + all_questions_2[x] + ",";
    }

    questions2 = questions2.substring(0,questions2.length - 1);

    //questions 1
    var params = questions1;

          var jsonStrig = '{';
          var items = params.split(',');
          for (var i = 0; i < items.length; i++) {
              var current = items[i].split(':');
              jsonStrig += '"' + current[0] + '":"' + current[1] + '",';
          }
          jsonStrig = jsonStrig.substring(0, jsonStrig.length - 1);
          jsonStrig += '}';
          //console.log(jsonStrig); //[{"domain":"Abcd-E-Group","domaintype":"com","Submit1":"Search"}]
          var obj = JSON.parse(jsonStrig);
          //console.log(obj.Type1Q1);

    test = Object.assign(test,obj);
    //questions 2

    params = questions2;

          var jsonStrig = '{';
          var items = params.split(',');
          for (var i = 0; i < items.length; i++) {
              var current = items[i].split(':');
              jsonStrig += '"' + current[0] + '":"' + current[1] + '",';
          }
          jsonStrig = jsonStrig.substring(0, jsonStrig.length - 1);
          jsonStrig += '}';
          //console.log(jsonStrig); //[{"domain":"Abcd-E-Group","domaintype":"com","Submit1":"Search"}]
          var obj = JSON.parse(jsonStrig);
          //console.log(obj.Type1Q1);

    test = Object.assign(test,obj);

    console.log(test);

    const sendJson = JSON.stringify(test);

    var xhr = new XMLHttpRequest();
    url = urlBase + "/createSurvey." + ext;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        // Wait for async return
        xhr.onreadystatechange = function () {
            // Handle the return from api
            if (this.readyState == 4 && this.status == 200) {
                // Have to double parse the response to ensure response is turned into object
                let returnJson = JSON.parse(xhr.responseText);
                surveyID = returnJson.SurveyID;

                //Assign to php and send emails
                for(var i = 0; i < emails_checked.length; i++){
                    //SEND EMAIL TO WHO WAS ASSIGNED!!
                    assigned_to(returnJson.SurveyID,emails_checked[i]);
                    //console.log(emails[i]);
                    Send_Email(emails[i]);
                }
            
                console.log(surveyID);
                console.log(returnJson);
                
                //Get the survey ID and store it to later assign

                // Check for error
                if (returnJson.error !== "" && returnJson.error !== "No Records Found") {
                    console.log(returnJson.error);
                    return;
                }

            }
        };
        xhr.send(sendJson);
    } catch (err) {
        // Display error
       console.log(err);
    }
    
    //Assign to survey PHP
    clear();
}


function assigned_to(x, y){



    //First call API to get all the UserID based on their emails

    //[$inData["SurveyID"], $inData["UserID"], $inData["Type1"], $inData["Type2"]]
    test = {SurveyID: x, Email: y}
    console.log(test);

    
    const sendJson = JSON.stringify(test);
    var xhr = new XMLHttpRequest();
    url = urlBase + "/assignedTo." + ext;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        // Wait for async return
        xhr.onreadystatechange = function () {
            // Handle the return from api
            if (this.readyState == 4 && this.status == 200) {
                // Have to double parse the response to ensure response is turned into object
                let returnJson = JSON.parse(xhr.responseText);
                // Check for error
                if (returnJson.error !== "") {
                    console.log(returnJson.error);
                    return;
                }

            }
        };
        xhr.send(sendJson);
    } catch (err) {
        // Display error
       console.log(err);
    }


}
function Send_Email(x){
    Email.send({
        SecureToken : "3465e64c-96d7-4f0d-9f10-bb084924bbab",
        To : x,
        From : "databasesystemgroup11@gmail.com",
        Subject : "You have receive a task!",
        Body : "Hi there! " + readCookieAttr("FirstName") + " sent you a survey to complete. The name of the survey is " + name_survey.value + " and the deadline is " + endate.value + "."
    }).then(
      //message => alert(message)
    );
}


function display_users_emails(emails){
    
    var inputContainer = document.getElementById("assignto_div");

    //Pass the array of all emails

    for(var i = 0; i < emails.length; i++){

        var newForm = document.createElement("input");
        newForm.setAttribute("type", "checkbox");
        newForm.setAttribute("id","check"+ i);
        inputContainer.appendChild(newForm);

    
        var label = document.createElement("label");
        label.setAttribute("for","check" + i);
        label.innerHTML = emails[i];

        inputContainer.appendChild(label);
        inputContainer.appendChild(document.createElement("br"));
    }
}

//Function that will clear all input values
function clear(){

   //Reset colors
   document.getElementById("name_survey").style.borderColor = "lightgrey";
   document.getElementById("NumType1").style.borderColor = "lightgrey";
   document.getElementById("NumType2").style.borderColor = "lightgrey";


   document.getElementById("description_survey").style.borderColor = "lightgrey";
   document.getElementById("start_date").style.borderColor = "lightgrey";
   document.getElementById("end_date").style.borderColor = "lightgrey";

   first_number.value = "";
   second_number.value = "";

   document.getElementById("type1").checked = false;
   document.getElementById("type2").checked = false;
   document.getElementById("description_survey").value = "";
   document.getElementById("name_survey").value = "";

   const myNode = document.getElementById("divfirstquestions");
   while (myNode.firstChild) {
     myNode.removeChild(myNode.lastChild);
   }

   const myNode2 = document.getElementById("divsecondquestions");
   while (myNode2.firstChild) {
    myNode2.removeChild(myNode2.lastChild);
   }

   const myNode3 = document.getElementById("assignto_div");
   while (myNode3.firstChild) {
    myNode3.removeChild(myNode3.lastChild);
   }

};


function first_choice(){
    if(first.style.display === "none"){
        first.style.display = "block";
    }
    else{
        first.style.display = "none";
    }
};

function second_choice(){
    if(second.style.display === "none"){
        second.style.display = "block";
    }
    else{
        second.style.display = "none";
    }
};

