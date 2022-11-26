
function addItem(){
    var li = document.createElement("LI");  
    var input = document.getElementById("name_survey");
    li.innerHTML = input.value;
    input.value = "";

    document.getElementById("surveys").appendChild(li);
}

const first = document.getElementById("first")
const second = document.getElementById("second");
const third = document.getElementById("third");

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