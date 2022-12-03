//Setting up questions that will be displayed depending if the selection was made or not
const first = document.getElementById("first")
const second = document.getElementById("second");

const name_survey = document.getElementById("name_survey");

const first_number = document.getElementById("NumType1");
const second_number = document.getElementById("NumType2");


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
    clear();


};

function create(){

    var li = document.createElement("LI");  
    var input = document.getElementById("name_survey");
    li.innerHTML = input.value;
    input.value = "";

    document.getElementById("surveys").appendChild(li);


    document.getElementById("creation_wrapper").style.display = "block";
    document.getElementById("questions_wrapper").style.display = "none";
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

