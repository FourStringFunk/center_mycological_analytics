/**
 * .js for validating new username and password (client side)
 */
const form = document.getElementById('loginForm')
const firstName = document.getElementById('fName');
const lastName = document.getElementById('lName');
const emailInput = document.getElementById('email');
const Password = document.getElementById('password');
const Verify_Password = document.getElementById('verifyPassword');

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
    const fName = firstName.value.trim()
    const lName = lastName.value.trim()
    const email = emailInput.value.trim()
    const password = Password.value.trim() 
    const verify = Verify_Password.value.trim();

    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/;

    if (!emailPattern.test(email)){
        return msgs[msgs.length] = "Please enter a valid email address.";
    } else if(!passwordPattern.test(password)){
        return msgs[msgs.length] = "Please enter a valid password of 1 uppercase, 1 lowecase, 1 special char, and 1 digit.";
    } else if(password !== verify) {
        return msgs[msgs.length] = "Passwords do not match.";
    }
    // Fetch API, returns a Promise
        try{
            const response = await fetch('/api/users/create/newuser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
                // If login is successful, redirect to dashboard
                if (response.ok) {
                    // set the session token in the browser
                    const data = await response.json();
                    document.cookie = `session_token=${data.newSession.session_token}; path=/`; // set the cookie
                    msgs[msgs.length] = 'Profile Created!';
                    // now load a new box which will allow the user to input their username, sends a GET request
                    setTimeout(() => {window.location.href = '/api/proile';}, 650);
                    return;
                } else {
                    // Display error message from server
                    // you have to use await or it wont work
                    const data = await response.json();
                    console.error({message: "Server error", Error: data})
                    msgs[msgs.length] = data.message
                    displayErrorMsgs(msgs)
                    return;
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

// document.cookie:  session_token=b1d11468-7ac6-4bbc-9598-758ae20dcfb1