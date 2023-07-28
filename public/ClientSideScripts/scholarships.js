/**
 * .js for scholarship application (client side)
 */
const form = document.getElementById('scholarshipApplicationForm')
const fName = document.getElementById('fName');
const lName = document.getElementById('lName');
const emailInput = document.getElementById('applicationEmail');
const add = document.getElementById('address');
const add2 = document.getElementById('address2');
const town = document.getElementById('city');
const nation = document.getElementById('country');
const zipcode = document.getElementById('zip');

const submitbtn = document.getElementById('formSubmit');

let msgs = [];
const displayErrorMsgs = function(msgs) {
    const ul = document.createElement('ul'); //create an element to hold our errors
    ul.classList.add('messages') // add a class to the ul
    // clear the ul before appending new messages
    while(ul.firstChild){
        ul.removeChild(ul.firstChild);
    }
    for(let msg of msgs){
        const li = document.createElement('li');
        const text = document.createTextNode(msg);
        li.appendChild(text);
        ul.appendChild(li)
    }
    const node = document.querySelector('.messages'); // select the node we just made

    if(node == null){
        form.parentNode.insertBefore(ul, form) 
    } else{
        node.parentNode.replaceChild(ul, node);
    } 
}
const clearErrors = function(){
    const elements = document.getElementsByClassName('messages')
    Array.from(elements).forEach(function(element){
        element.remove()
    });
    msgs = []; 
}
let validate = async function() {
    clearErrors()
    // reminder, these are the elements youll pass to the api call, fName, lName etc.
    
    const firstName = fName.value.trim()
    const lastName = lName.value.trim()
    const email = emailInput.value.trim()
    const address = add.value.trim() 
    const address2 = add2.value.trim();
    const city = town.value.trim() 
    const country = nation.value.trim();
    const zip = zipcode.value.trim();

    const address = add.value.trim() 
    const address2 = add2.value.trim();
    const city = town.value.trim() 
    const country = nation.value.trim();
    const zip = zipcode.value.trim();

    if (!firstName || ""){
        return msgs[msgs.length] = "Please enter a first name.";
    } else if(!lastName || ""){
        return msgs[msgs.length] = "Please enter a last name";
    } else if(!email || "") {
        return msgs[msgs.length] = "Please enter an email";
    } else if(!address || ""){
        return msgs[msgs.length] = "Please enter an address";
    } else if(!city || ""){
        return msgs[msgs.length] = "Please enter a city";
    } else if(!country || ""){
        return msgs[msgs.length] = "Please enter a country";
    } else if(!zip || ""){
        return msgs[msgs.length] = "Please enter a zip";
    } 
    // Fetch API, returns a Promise
        try{
            const response = await fetch('/api/contact/scholarship', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    firstName, lastName, 
                    email, address, 
                    address2, city,
                    country, zip,
                     })
            });
                // If login is successful, redirect to dashboard
                if (response.ok) {
                    // set the session token in the browser
                    const data = await response.json();
                    let expiryDate = new Date();
                    expiryDate.setTime(expiryDate.getTime() + (30 * 60 * 1000)); // Expire in 30 minutes
                    document.cookie = `session_token=${data.newSession.session_token}; expires=${expiryDate.toUTCString()}; path=/`;
                    msgs[msgs.length] = 'Profile Created!';
                    // now load a new box which will allow the user to input their username, sends a GET request
                    setTimeout(() => {window.location.href = '/api/profile';}, 650);
                    return;
                } else {
                    // Display error message from server
                    // you have to use await or it wont work
                    
                    console.error({message: "Server error"})
                    msgs[msgs.length] = data.message
                    displayErrorMsgs(msgs)
                    return;
                }
        }catch(err){
            console.error({message:"Server e", Error: err})
        }finally{
            displayErrorMsgs(msgs)
        }
}
const init = () =>{
    document.addEventListener("DOMContentLoaded", function () {
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          validate();
        });
    });
}
init();
