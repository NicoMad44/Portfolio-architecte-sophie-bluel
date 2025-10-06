/*************************************
 * SCRIPT is for the Login Page only
 * ***********************************/

const emailInputElement = document.getElementById("email");
const submitButton = document.getElementById("submitButton");
const form = document.querySelector("form");

// Creation of the error message to be un-hidden when requiered
const errorMessage = document.createElement("p");
errorMessage.innerText = "Erreur dans l’identifiant ou le mot de passe";
errorMessage.classList.add("errorMessage", "hidden");
form.appendChild(errorMessage);

// upon the click the function login is called with the info from users
form.addEventListener("submit", (event)=>{
    event.preventDefault();
    const emailInputElement = document.getElementById("email");
    const passwordInputElement = document.getElementById("password");
    
    console.log(emailInputElement.value + " - " + passwordInputElement.value);

    login(emailInputElement.value, passwordInputElement.value)

});


/** 
 * the function make an API request to POST user credential and
 * if in db, put the token received from API in local storage.
 * @param {string} email : the email entered by the user
 * @param {string} password : the password entered by the user
 */
async function login(email, password) {
    const response = await fetch('http://localhost:5678/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ "email": email,
                             "password": password
                            })
    });
  
    if (!response.ok) {
        errorMessage.classList.remove("hidden");
        throw new Error('Login failed');
    } 
  
    const data = await response.json();
    // "data" contains the token if login succeeded
    errorMessage.classList.add("hidden");
    window.localStorage.setItem(data.userId, data.token);
    window.location.href = 'index.html';
  }

