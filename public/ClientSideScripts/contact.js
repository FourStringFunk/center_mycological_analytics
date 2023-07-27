/**
 * .js to manage the 'get in touch' feature
 */
const form = document.getElementById('contactForm')
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const emailInput = document.getElementById('emailInput');
const text = document.getElementById('message');


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
    const message = text.value.trim() 
    
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/;

    if (!emailPattern.test(email)){
        return msgs[msgs.length] = "Please enter a valid email address.";
    }
    // Fetch API, returns a Promise
        try{
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fName, lName, email, message })
            });
                // If login is successful, redirect to dashboard
                if (response.ok) {
                    msgs[msgs.length] = 'Message Sent!';
                    // now load a new box which will allow the user to input their username, sends a GET request
                    setTimeout(() => {window.location.href = '/';}, 650);
                    return;
                } else {
                    // Display error message from server
                    // you have to use await or it wont work
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