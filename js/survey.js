
const urlBase = "https://petrillo.zone/api";
const ext = "php";


//Setting up questions that will be displayed depending if the selection was made or not
const first = document.getElementById("first")
const second = document.getElementById("second");

const name_survey = document.getElementById("name_survey");

const first_number = document.getElementById("NumType1");
const second_number = document.getElementById("NumType2");



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

    if(name_survey.value == ""){
        document.getElementById("name_survey").style.borderColor = "red";
        alert("No name");
        return;
    }
    else{
        document.getElementById("name_survey").style.borderColor = "green";
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
            inputContainer.appendChild(newForm);
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
            inputContainer_2.appendChild(newForm_2);
            inputContainer_2.appendChild(document.createElement("br"));
        }
        second_choice();
    }


};

function Next_2(){
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
                   display_users_emails(returnJson);
                   // Check for error
                   if (returnJson.error !== "" && returnJson.error !== "No Records Found") {
                       console.log(returnJson.error);
                       return;
                   }
   
               };
           }
           xhr.send(sendJson);
       } catch (err) {
           // Display error
          console.log(err);
       }


}

function create(){

    clear();
    
    document.getElementById("creation_wrapper").style.display = "block";
    document.getElementById("assignto_wrapper").style.display = "none";

    var li = document.createElement("LI");  
    var input = document.getElementById("name_survey");
    li.innerHTML = input.value;
    input.value = "";

    document.getElementById("surveys").appendChild(li);

    

    //Function to send emails to users that were selected.

    //Pass list as parameter from all the users assigned
    //sendEmail();


}


//FIX THIS FUNCTION
function sendEmail() {
    Email.send({
      Host: "smtp.gmail.com",
      Username: "yanirismejia15@hotmail.com",
      Password: "mexico15",
      To: 'theluiszone777@gmail.com',
      From: "yanirismejia15@hotmail.com",
      Subject: "You have received a survey to complete!",
      Body: "TESTING",
    })
      .then(function (message) {
        alert("mail sent successfully")
      });
  }

const email = 0;
//Checking if the email was checked or not
for(var i = 0; i < x; i++){
        
}

function display_users_emails(returnJson){
    
    var inputContainer = document.getElementById("assignto_div");

    //Pass the array of all emails

    for(var i = 0; i < returnJson.Emails.length; i++){

        var newForm = document.createElement("input");
        newForm.setAttribute("type", "checkbox");
        newForm.setAttribute("id","check"+ i);
        inputContainer.appendChild(newForm);

    
        var label = document.createElement("label");
        label.setAttribute("for","check" + i);
        label.innerHTML = returnJson.Emails[i];

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

   first_number.value = "";
   second_number.value = "";

   document.getElementById("type1").checked = false;
   document.getElementById("type2").checked = false;
   document.getElementById("description_survey").value = "";

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

