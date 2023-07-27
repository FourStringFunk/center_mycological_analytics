/**
 * Script to santize user input
 */
const form = document.getElementById('loginForm')
const emailInput = document.getElementById('username');
const submitbtn = document.getElementById('formSubmit');
const passwordInput = document.getElementById("password");
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
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/;
    if (!emailPattern.test(email)){
        msgs[msgs.length] = "Please enter a valid email address.";
        return
    }
    // Fetch API for making AJAX requests, returns a Promise
        try{
            const response = await fetch('/api/users/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
                // If login is successful, redirect to dashboard
                if (response.ok) {
                    const data = await response.json();
                    // we need to set the cookie in the browser
                    let expiryDate = new Date();
                    expiryDate.setTime(expiryDate.getTime() + (30 * 60 * 1000)); // Expire in 30 minutes
                    document.cookie = `session_token=${data.newSession.session_token}; expires=${expiryDate.toUTCString()}; path=/`;
                    msgs[msgs.length] = "Login Success!";
                    displayErrorMsgs(msgs)
                    setTimeout(() => {window.location.href = '/api/profile';}, 550);
                } else {
                    // Display error message from server
                    // you have to use await or it wont work
                    const data = await response.json();
                    console.log({message: "Server e", Error: data})
                    msgs[msgs.length] = data.message
                }
        }catch(err){
            console.error({message:"Server error", Error: err})
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