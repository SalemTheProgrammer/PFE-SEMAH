const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const diplomeButton = document.getElementById('diplomeButton');
const formationButton = document.getElementById('formationButton');
const diplomeFormation = document.getElementById('diplomeFormation');
const universityCentre = document.getElementById('universityCentre');
const messageDiv = document.getElementById('message');

diplomeButton.addEventListener('click', () => {
    diplomeFormation.placeholder = "Diploma";
    universityCentre.placeholder = "University";
});

formationButton.addEventListener('click', () => {
    diplomeFormation.placeholder = "Formation";
    universityCentre.placeholder = "Centre Formation";
});

registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        diplome: diplomeFormation.value,
        year: document.getElementById('year').value,
        university: universityCentre.value
    };

    console.log('Form Data:', data); // Log form data

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Registration successful:', responseData);
            // Handle successful registration (e.g., redirect, show a message)
        } else {
            const errorData = await response.json();
            console.error('Registration failed:', errorData);
            // Handle registration error (e.g., show error message)
        }
    } catch (error) {
        console.error('Error:', error);
        // Handle network or other errors
    }
});

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = {
        email: document.getElementById('loginEmail').value,
        password: document.getElementById('loginPassword').value
    };

    console.log('Login Data:', data); // Log login data

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Login successful:', responseData);
            messageDiv.textContent = "You logged in successfully";
            messageDiv.style.display = 'block';
            messageDiv.style.color = 'green';
            // Handle successful login (e.g., redirect, show a message)
        } else {
            const errorData = await response.json();
            console.error('Login failed:', errorData);
            messageDiv.textContent = "Login failed: " + errorData.error;
            messageDiv.style.display = 'block';
            messageDiv.style.color = 'red';
            // Handle login error (e.g., show error message)
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.textContent = "An error occurred: " + error.message;
        messageDiv.style.display = 'block';
        messageDiv.style.color = 'red';
        // Handle network or other errors
    }
});