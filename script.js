"use strict"

const submit = document.querySelector("#submit");
const firstNameInput = document.querySelector(".firstName");
const lastNameInput = document.querySelector(".lastName");
const phoneNumberInput = document.querySelector(".phoneNumber");
const table = document.querySelector("tbody");
const error = document.querySelector(".error");
const overlay = document.querySelector(".overlay");
const modalWindow = document.querySelector(".modal");
const deleteYes = document.querySelector(".deleteYes");
const deleteCancel = document.querySelector(".deleteCancel");
const searchField = document.querySelector(".searchBarInput");

let deleteRecord = document.querySelectorAll(".delete");
let deleteName;
let deleteNumber;
let nameHeader = document.querySelector(".nameHeader");
let storageName = []
let storageNumber = []
let storage = [];

let totalEntries = 0;

const submitForm = function(e) {
    e.preventDefault();
    
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const number = phoneNumberInput.value;
    const name = firstName + " " + lastName;
    const data = {
        sNo: totalEntries + 1,
        firstName: firstName,
        lastName: lastName,
        num: number
    }
    
    if(checkUnique(name, number)) {

        storage.push(data);
        storageName.push(name)
        storageNumber.push(number)

        firstNameInput.value = "";
        lastNameInput.value = "";
        phoneNumberInput.value = "";
        
        showData(firstName, lastName, number)
        totalEntries++;
        removeError()
        createEventListner()
    }
    else {
        showError()
    }
}

const checkUnique = function(name, number) {
    return !(storageName.includes(name) || storageNumber.includes(number))
}

const showError = function() {
    error.classList.remove("hidden")
}
const removeError = function() {
    error.classList.add("hidden")
}

const showData = function(firstName, lastName, number, entryNumber = totalEntries+1) {
    const html = `<tr>
    <td class="sNo">${entryNumber}</td>
    <td class="name">${firstName+" "+lastName}</td>
    <td class="pNo">${number}</td>
    <td class="delete">X</td>
</tr>`

    table.insertAdjacentHTML("beforeend", html);
}

const sortCallBack = function(a, b) {
    const nameA = a.firstName.toUpperCase() + a.lastName.toUpperCase();
    const nameB = b.firstName.toUpperCase() + b.lastName.toUpperCase();
    if (nameA > nameB) {
        return 1;
    }
    if (nameA < nameB) {
        return -1;
    }
    return 0;
}

const insertTableHeader = function() {
    let html = `<tr>
    <th class="sNoHeader">Serial Number</th>
    <th class="nameHeader">Name</th>
    <th class="pNoHeader">Phone Number</th>
    <th class="deleteHeader">Delete</th>
    </tr>`

    table.insertAdjacentHTML("beforeend", html);
}

const output = function(e, flag = true) {
    table.innerHTML = "";

    insertTableHeader()

    if(flag == true){
        storage.sort(sortCallBack);
        storageName.sort()
    }

    let entry = 1
    for(let item of storage) {
        showData(item.firstName, item.lastName, item.num, entry)
        entry++;
    }

    nameHeader = document.querySelector(".nameHeader");
    nameHeader.addEventListener('click', output)
}

const deleteRecordFunction = function(e) {

    overlay.classList.toggle("hidden");
    modalWindow.classList.toggle("hidden");
    
    deleteName = e.target.closest('tr').innerText.split("\t")[1];
    deleteNumber = e.target.closest('tr').innerText.split("\t")[2];
}

const removeRecord = function(deleteName, deleteNumber) { 
    
    storageName.splice(storageName.indexOf(deleteName), 1)
    storageNumber.splice(storageNumber.indexOf(deleteNumber), 1)
    let i = 0
    for(i = 0; i < totalEntries; i++) {
        if(storage[i].firstName == deleteName.split(" ")[0]) {
            break;
        }
    }
    storage.splice(i,1);
    output(null, false)
    createEventListner();
}

//EVENT LISTNERS
nameHeader.addEventListener('click', output);
submit.addEventListener("click", submitForm);
const createEventListner = function() {
    deleteRecord = document.querySelectorAll(".delete");
    deleteRecord.forEach((ele) => {
        ele.addEventListener('click', deleteRecordFunction);
    })
}
overlay.addEventListener('click', function() {
    overlay.classList.toggle("hidden");
    modalWindow.classList.toggle("hidden");
});
deleteYes.addEventListener("click", function(e) {
    removeRecord(deleteName, deleteNumber);
    deleteName = null;
    deleteNumber = null;
    overlay.classList.toggle("hidden");
    modalWindow.classList.toggle("hidden");
    totalEntries--;
})
deleteCancel.addEventListener("click", function() {
    overlay.classList.toggle("hidden");
    modalWindow.classList.toggle("hidden");
})


const searchTable = function() {
    const val = searchField.value;
    if(document.activeElement != searchField){
        return;
    }
    if(val == "") {
        output(null, false)
        return;
    }
    table.innerHTML = ""
    insertTableHeader()
    let k = 1;
    for(let i = 0; i < totalEntries; i++) {
        if(storageName[i].includes(val)) {
            console.log("hai");
            showData(storage[i].firstName, storage[i].lastName, storage[i].num, k++);
            createEventListner()
        }
    }
    
}
setInterval(searchTable, 1000)