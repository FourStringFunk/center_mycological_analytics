/**
 * .js for scholarship application (client side)
 */


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
    const address2 = add2.value.trim()
    const city = town.value.trim() 
    const country = nation.value.trim()
    const zip = zipcode.value.trim()
    const employmentStatus = document.getElementById('employmentStatus').value
    const incomeRange = document.getElementById('incomeRange').value
    const employmentStatus2 = document.getElementById('employmentStatus2').value
    const paymentInFull = document.getElementById('paymentInFull').value
    const paymentPlan = document.getElementById('paymentPlan').value
    const coverLetter = document.getElementById('coverLetter').files[0]

    let formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('address', address);
    formData.append('address2', address2);
    formData.append('city', city);
    formData.append('country', country);
    formData.append('zip', zip);
    formData.append('employmentStatus', employmentStatus);
    formData.append('incomeRange', incomeRange);
    formData.append('employmentStatus2', employmentStatus2);
    formData.append('paymentInFull', paymentInFull);
    formData.append('paymentPlan', paymentPlan);
    formData.append('coverLetter', coverLetter);

    if (!firstName){
        return msgs[msgs.length] = "Please enter a first name.";
    } else if(!lastName){
        return msgs[msgs.length] = "Please enter a last name";
    } else if(!email) {
        return msgs[msgs.length] = "Please enter an email";
    } else if(!address){
        return msgs[msgs.length] = "Please enter an address";
    } else if(!city){
        return msgs[msgs.length] = "Please enter a city";
    } else if(!country){
        return msgs[msgs.length] = "Please enter a country";
    } else if(!zip){
        return msgs[msgs.length] = "Please enter a zip";
    } 
    // Fetch API, returns a Promise
        try{
            const response = await fetch('/api/contact/scholarship', {
                method: 'POST',
                body: formData
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
                    setTimeout(() => {window.location.href = '/';}, 650);
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
