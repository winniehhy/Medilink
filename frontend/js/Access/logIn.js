document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const errorMessage = document.getElementById('errorMessage');
    const loading = document.getElementById('loading');

    loginButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Basic validation
        if (!username || !password) {
            showError('Please enter both username and password');
            return;
        }

        // Show loading state
        loading.style.display = 'block';
        errorMessage.style.display = 'none';
        loginButton.disabled = true;

        try {
            // First try hospital login
            const hospitalResponse = await fetch('/api/hospital-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const hospitalData = await hospitalResponse.json();

            if (hospitalResponse.ok) {
                // Successful hospital login
                window.location.href = 'Pages/Hospital/hospital_homepage.html';
                return;
            }

            // If hospital login fails, try nursing home login
            const nursingHomeResponse = await fetch('/api/nursinghome-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            const nursingHomeData = await nursingHomeResponse.json();

            if (nursingHomeResponse.ok) {
                // Successful nursing home login
                window.location.href = 'Pages/Nursing/nursing_homepage.html';
                return;
            }

            // If both fail, show error message
            showError('Invalid username or password. Please try again.');
            
        } catch (error) {
            console.error('Login error:', error);
            showError('Connection error. Please try again.');
        } finally {
            // Hide loading state
            loading.style.display = 'none';
            loginButton.disabled = false;
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    // Allow Enter key to trigger login
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginButton.click();
        }
    });
});