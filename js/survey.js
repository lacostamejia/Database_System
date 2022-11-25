
function addItem(){
    var li = document.createElement("LI");  
    var input = document.getElementById("name_survey");
    li.innerHTML = input.value;
    input.value = "";

    document.getElementById("surveys").appendChild(li);
}
