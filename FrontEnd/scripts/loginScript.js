const emailInputElement = document.getElementById("email");
const submitButton = document.getElementById("submitButton");
const form = document.querySelector("form");

const errorMessage = document.createElement("p");
errorMessage.innerText = "Sorry, invalid email and/or password, please try again.";
errorMessage.classList.add("errorMessage", "hidden");
form.appendChild(errorMessage);

form.addEventListener("submit", (event)=>{
    event.preventDefault();
    const emailInputElement = document.getElementById("email");
    const passwordInputElement = document.getElementById("password");
    console.log(emailInputElement.value + " - " + passwordInputElement.value);

    login(emailInputElement.value, passwordInputElement.value)

});


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

