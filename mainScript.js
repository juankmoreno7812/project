
getDataFromJSon();

var filters = {userName: "", costumerSat: "", priority: "", status: ""};

var JSonUsers = [];

var filtersSpace = document.getElementById("filtersSpace");
var pagination = document.getElementById("pagination");
var labelUsers = document.getElementById("labelUsers");

var userNameLink = document.getElementById("userNameLink");
var costumerSatLink = document.getElementById("costumerSatLink");
var priorityLink = document.getElementById("priorityLink");
var statusLink = document.getElementById("statusLink");

var perPage = 10;
var index = 0;

filtersSpace.addEventListener("click",
    function (event) {
        const target = event.target;
        if(target.matches("button")){
            if(target.id.indexOf("Action") != -1){
                if(target.id.indexOf("userName") != -1){
                    filters.userName = document.getElementById("userNameInput").value;
                }else if(target.id.indexOf("costumerSat") != -1){
                    filters.costumerSat = document.getElementById("costumerSatInput").value;
                }else if(target.id.indexOf("priority") != -1){
                    filters.priority = document.getElementById("priorityInput").value;
                }else if(target.id.indexOf("status") != -1){
                    filters.status = document.getElementById("statusInput").value;
                }
            }else if(target.id.indexOf("Cancel") != -1){
                if(target.id.indexOf("userName") != -1){
                    filters.userName = "";
                    var card = document.getElementById("userNameFilterCard");
                    card.parentNode.removeChild(card);
                    userNameLink.disabled = false;
                }else if(target.id.indexOf("costumerSat") != -1){
                    filters.costumerSat = "";
                    var card = document.getElementById("costumerSatFilterCard");
                    card.parentNode.removeChild(card);
                    costumerSatLink.disabled = false;
                }else if(target.id.indexOf("priority") != -1){
                    filters.priority = "";
                    var card = document.getElementById("priorityFilterCard");
                    card.parentNode.removeChild(card);
                    priorityLink.disabled = false;
                }else if(target.id.indexOf("status") != -1){
                    filters.status = "";
                    var card = document.getElementById("statusFilterCard");
                    card.parentNode.removeChild(card);
                    statusLink.disabled = false;
                }
            }
            console.log("filters: " + filters.userName + ", " + filters.costumerSat + ", " + filters.priority + ", " + filters.status + ".");
            index = 0;
            getDataFromJSon();
        }
    }
);

pagination.addEventListener("click",
    function (event) {
        console.log("click...!");
        const target = event.target;
        if(target.matches("button")){
            var page = parseInt(target.id.replace("page", ""));
            index = (page - 1) * perPage;
            getDataFromJSon();
        }
    }
);

function getDataFromJSon() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "source.json", true);
    xhttp.send();
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            var data = JSON.parse(this.responseText);
            var dynamicTable = document.querySelector("#dynamicTable");
            dynamicTable.innerHTML = "";
            JSonUsers = [];
            for(var user of data){
                if(filterData(user)){
                    JSonUsers.push(user);
                }
            }
            labelUsers.innerHTML = JSonUsers.length + " user(s) found...!";
            var userCounter = 0;
            while(userCounter < perPage && index < JSonUsers.length){
                var JSonUser = JSonUsers[index];
                switch (JSonUser.priority) {
                    case "High":
                        var iconColor = "238, 96, 60";
                        break;
                    case "Medium":
                        var iconColor = "250, 209, 88";
                        break;
                    case "Low":
                        var iconColor = "155, 159, 159";
                        break;
                }
                dynamicTable.innerHTML +=
                    `<tr>
                        <th scope="row" class="text-left">${JSonUser.userName}</th>
                        <td class="text-left">${JSonUser.subject}</td>
                        <td class="text-center">${JSonUser.costumerSat + " %"}</td>
                        <td class="text-left"><i class="fas fa-dot-circle fa-xs" style="color:rgb(${iconColor})"></i>${' ' + JSonUser.priority}</td>
                        <td>${JSonUser.status}</td>
                        <td class="text-center"><a data-toggle="modal" href="${'#modal' + userCounter.toString(10)}">View details</a></td>
                    </tr>
                    <div class="modal fade" id="${'modal' + userCounter.toString(10)}">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h3 class="modal-title">${JSonUser.userName}</h3>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        &times;
                                    </button>
                                </div>                
                                <div class="modal-body">
                                    <form>
                                        <div class="form-group">
                                            <label for="formGroupExampleInput" class="pb-3">
                                                <h4>Metrics</h4>
                                            </label>
                                            <div id="${'metrics' + userCounter.toString(10)}"></div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>`;
                var metrics = document.getElementById("metrics" + userCounter.toString(10));
                for(var metric of JSonUser.metrics){
                    metrics.innerHTML +=
                        `<div>
                            <label class="font-weight-bold">${metric.id + ': ' + metric.value + 'min'}</label>
                        </div>`;
                }
                userCounter += 1;
                index += 1;
            }
            if (index === JSonUsers.length && userCounter < perPage){
                makePagination(parseInt(index / perPage) + 1);
            }else{
                makePagination(parseInt(index / perPage));
            }
        }
    }
}

function makePagination(selectedPage){
    var li = 1;
    pagination.innerHTML = "";
    for(var i = 1; i <= JSonUsers.length; i++){
        if(i % perPage === 0){
            if(li === selectedPage){
                pagination.innerHTML +=
                    `<li class="page-item active" aria-current="page">
                        <span class="page-link">${li}<span class="sr-only">(current)</span></span>
                    </li>`;
            }else{
                pagination.innerHTML +=
                    `<li class="page-item">
                        <button class="page-link" id="${'page' + li.toString(10)}">${li}</button>
                    </li>`;
            }
            li++;
        }
    }
    if(JSonUsers.length % perPage !== 0){
        if(li === selectedPage){
            pagination.innerHTML +=
                `<li class="page-item active" aria-current="page">
                    <span class="page-link">${li}<span class="sr-only">(current)</span></span>
                </li>`;
        }else{
            pagination.innerHTML +=
                `<li class="page-item">
                    <button class="page-link" id="${'page' + li.toString(10)}">${li}</button>
                </li>`;
        }
    }
}

function filterData(data) {
    if(filters.userName != "") {
        if(data.userName != filters.userName){return false;}
    }
    if(filters.costumerSat != "") {
        if(data.costumerSat != filters.costumerSat){return false;}
    }
    if(filters.priority != "") {
        if(data.priority != filters.priority){return false;}
    }
    if(filters.status != "") {
        if(data.status != filters.status){return false;}
    }
    return true;
}

function addFilter(filterType){
    switch(filterType){
        case "userName":
            filtersSpace.innerHTML +=
                `<div class="card border-primary mx-2 my-3" style="width: 23%;" id="userNameFilterCard">
                    <h5 class="card-header">User name</h5>
                    <div class="card-body">
                        <tr>
                            <div class="mb-2">
                                <input type="text" class="form-control mr-sm-2" placeholder="User name" id="userNameInput">
                            </div>
                        </tr>
                        <tr>
                            <div class="container">
                                <div class="row justify-content-center d-flex">
                                    <button type="button" class="btn btn-primary flex-fill mr-1" id="userNameActionButton">
                                        Filter
                                    </button>
                                    <button type="button" class="btn btn-outline-dark flex-fill ml-1" id="userNameCancelButton">
                                        Remove filter
                                    </button>
                                </div>
                            </div>
                        </tr>
                    </div>
                </div>`;
            userNameLink.disabled = true;
            break;
        case "costumerSat":
            filtersSpace.innerHTML +=
                `<div class="card border-success mx-2 my-3" style="width: 23%;" id="costumerSatFilterCard">
                    <h5 class="card-header">Costumer satisfaction</h5>
                    <div class="card-body">
                        <tr>
                            <div class="def-number-input number-input safari_only mb-2">
                                <input class="quantity" class="form-control mb-2 mr-sm-2" min="0" max="100" value="1" type="number"
                                style="width:100%;height:40px;" id="costumerSatInput">
                            </div>
                        </tr>
                        <tr>
                            <div class="container">
                                <div class="row justify-content-center d-flex">
                                    <button type="button" class="btn btn-success flex-fill mr-1" id="costumerSatActionButton">
                                        Filter
                                    </button>
                                    <button type="button" class="btn btn-outline-dark flex-fill ml-1" id="costumerSatCancelButton">
                                        Remove filter
                                    </button>
                                </div>
                            </div>
                        </tr>
                    </div>
                </div>`;
            costumerSatLink.disabled = true;
            break;
        case "priority":
            filtersSpace.innerHTML +=
                `<div class="card border-danger mx-2 my-3" style="width: 23%;" id="priorityFilterCard">
                    <h5 class="card-header">Priority</h5>
                    <div class="card-body">
                        <tr>
                            <select class="custom-select mr-sm-2 mb-2" id="priorityInput">
                                <option selected value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </tr>
                        <tr>
                            <div class="container">
                                <div class="row justify-content-center d-flex">
                                    <button type="button" class="btn btn-danger flex-fill mr-1" id="priorityActionButton">
                                        Filter
                                    </button>
                                    <button type="button" class="btn btn-outline-dark flex-fill ml-1" id="priorityCancelButton">
                                        Remove filter
                                    </button>
                                </div>
                            </div>
                        </tr>
                    </div>
                </div>`;
            priorityLink.disabled = true;
            break;
        case "status":
            filtersSpace.innerHTML +=
                `<div class="card border-warning mx-2 my-3" style="width: 23%;" id="statusFilterCard">
                    <h5 class="card-header">Status</h5>
                    <div class="card-body">
                        <tr>
                            <select class="custom-select mr-sm-2 mb-2" id="statusInput">
                                <option selected value="Solved">Solved</option>
                                <option value="Open">Open</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </tr>
                        <tr>
                            <div class="container">
                                <div class="row justify-content-center d-flex">
                                    <button type="button" class="btn btn-warning flex-fill mr-1" id="statusActionButton">
                                        Filter
                                    </button>
                                    <button type="button" class="btn btn-outline-dark flex-fill ml-1" id="statusCancelButton">
                                        Remove filter
                                    </button>
                                </div>
                            </div>
                        </tr>
                    </div>
                </div>`;
            statusLink.disabled = true;
            break;
    }
}

function reset() {
    filters.userName = "";
    filters.costumerSat = "";
    filters.priority = "";
    filters.status = "";
    index = 0;
    getDataFromJSon();
    filtersSpace.innerHTML = "";
    userNameLink.disabled = false;
    costumerSatLink.disabled = false;
    priorityLink.disabled = false;
    statusLink.disabled = false;
}
