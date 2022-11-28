//Setting up questions that will be displayed depending if the selection was made or not
const first = document.getElementById("first")
const second = document.getElementById("second");
const third = document.getElementById("third");

const name_survey = document.getElementById("name_survey");

const first_number = document.getElementById("quantity");
const second_number = document.getElementById("quantity2");
const third_number = document.getElementById("quantity3");


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
        document.getElementById("quantity").style.borderColor = "red";
        return;
    }
    else{
        document.getElementById("quantity").style.borderColor = "green";
    }
    if(second_number.value < 1 && second.style.display === "block"){
        alert("The number of questions need to be larger than 1");
        document.getElementById("quantity2").style.borderColor = "red";
        return;
     
    }
    else{
        document.getElementById("quantity2").style.borderColor = "green";
    }
    if(second_number.value < 1 && third.style.display === "block"){
        alert("The number of questions need to be larger than 1");
        document.getElementById("quantity3").style.borderColor = "red";
        return;
    }
    else{
        document.getElementById("quantity3").style.borderColor = "green";
    }

    askquestions(first_number.value,second_number.value,third_number.value);

};


function askquestions(x, y, z){

    document.getElementById("creation_wrapper").style.display = "none";
    document.getElementById("questions_wrapper").style.display = "block";

    if(x !== null){
        document.getElementById("divfirstquestions").style.display = "block";
        for(var i = 0; i < x; i++){

            var li = document.createElement("LI");
            //Issue here
            var input = document.createElement(<input type="text" placeholder="Question" required />);
            li.innerHTML = input;
            document.getElementById("list_questions1").appendChild(li);

        }
    }
    clear();

    document.getElementById("creation_wrapper").style.display = "block";
    document.getElementById("questions_wrapper").style.display = "none";


};

function create(){

    var li = document.createElement("LI");  
    var input = document.getElementById("name_survey");
    li.innerHTML = input.value;
    input.value = "";

    document.getElementById("surveys").appendChild(li);
}

//Function that will clear all input values
function clear(){

   //Reset colors
   document.getElementById("name_survey").style.borderColor = "lightgrey";
   document.getElementById("quantity").style.borderColor = "lightgrey";
   document.getElementById("quantity2").style.borderColor = "lightgrey";
   document.getElementById("quantity3").style.borderColor = "lightgrey";

   first_number.value = null;
   second_number.value = null;
   third_number.value = null;

   first_choice();
   second_choice();
   third_choice();
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

function third_choice(){
    if(third.style.display === "none"){
        third.style.display = "block";
    }
    else{
        third.style.display = "none";
    }
};

