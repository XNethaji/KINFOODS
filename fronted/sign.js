document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    // Show error message
    const showError = (input, message) => {
        const errorElement = input.nextElementSibling;
        errorElement.textContent = message;
        input.classList.add('error');
    };

    // Remove error message
    const clearError = (input) => {
        const errorElement = input.nextElementSibling;
        errorElement.textContent = '';
        input.classList.remove('error');
    };

    // Validate fields
    const validateField = (input) => {
        const value = input.value.trim();
        if (!value) {
            showError(input, 'This field is required');
            return false;
        }

        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError(input, 'Enter a valid email');
                return false;
            }
        }

        if (input.type === 'password' && value.length < 8) {
            showError(input, 'Password must be at least 8 characters');
            return false;
        }

        if (input.id === 'phone_no' && !/^\d{10}$/.test(value)) {
            showError(input, 'Enter a valid 10-digit phone number');
            return false;
        }

        clearError(input);
        return true;
    };

    // Handle Signup Form Submission
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const phone_no = document.getElementById('phone_no');
            const password = document.getElementById('password');

            let isValid = true;
            [name, email, phone_no, password].forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (!isValid) return;

            signupForm.querySelector('.submit-btn').textContent = 'Creating Account...';

            try {
                const response = await fetch("http://localhost:5000/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: name.value,
                        email: email.value,
                        phone_no: phone_no.value,
                        password: password.value
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Account created successfully! Redirecting to sign-in...");
                    window.location.href = "signin.html";
                } else {
                    alert(data.message || "Signup failed!");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Something went wrong. Please try again.");
            }

            signupForm.querySelector('.submit-btn').textContent = 'Create Account';
        });
    }
});document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    // Show error message
    const showError = (input, message) => {
        const errorElement = input.nextElementSibling;
        errorElement.textContent = message;
        input.classList.add('error');
    };

    // Remove error message
    const clearError = (input) => {
        const errorElement = input.nextElementSibling;
        errorElement.textContent = '';
        input.classList.remove('error');
    };

    // Validate fields
    const validateField = (input) => {
        const value = input.value.trim();
        if (!value) {
            showError(input, 'This field is required');
            return false;
        }

        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError(input, 'Enter a valid email');
                return false;
            }
        }

        if (input.type === 'password' && value.length < 8) {
            showError(input, 'Password must be at least 8 characters');
            return false;
        }

        if (input.id === 'phone_no' && !/^\d{10}$/.test(value)) {
            showError(input, 'Enter a valid 10-digit phone number');
            return false;
        }

        clearError(input);
        return true;
    };
    // Handle signin form submission
    if (signinForm) {
        signinForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email');
            const password = document.getElementById('password');

            let isValid = validateField(email) & validateField(password);

            if (!isValid) return;

            signinForm.querySelector('.submit-btn').textContent = 'Signing in...';

            try {
                const response = await fetch("http://localhost:5000/signin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: email.value,
                        password: password.value
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Login successful!");
                    localStorage.setItem("token", data.token);
                    window.location.href = "index.html";
                } else {
                    alert(data.message || "Login failed!");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Something went wrong. Please try again.");
            }

            signinForm.querySelector('.submit-btn').textContent = 'Sign In';//food
        });
    }

    // Validate fields on blur
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
    });
});