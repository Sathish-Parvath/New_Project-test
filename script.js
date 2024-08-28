document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    const users = [
        { username: 'Sathish', password: 'password' },
        { username: 'Diya', password: 'password' },
        { username: 'Sam', password: 'password' },
    ];

    if (path.endsWith('dashboard.html')) {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            window.location.href = 'index.html';
        } else {
            const toaster = document.getElementById('toaster');
            const toasterMessage = document.getElementById('toaster-message');
            
            toasterMessage.textContent = `Welcome, ${loggedInUser}!`;
            showToaster();
            
            loadTableData(loggedInUser);
            
            const userDetails = document.getElementById('user-details');
            const userName = userDetails.querySelector('p');
            userName.textContent = loggedInUser;
        }
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const errorMessage = document.getElementById('error-message');
            const toaster = document.getElementById('toaster');
            const toasterMessage = document.getElementById('toaster-message');

            let isValid = true;
            let validationMessage = '';

            errorMessage.textContent = '';

            
            const usernamePattern = /^[A-Za-z0-9]+$/;
            if (!usernamePattern.test(username)) {
                isValid = false;
                validationMessage += 'Username must be alphanumeric.<br>';
            }

            
            if (password.length < 8) {
                isValid = false;
                validationMessage += 'Password must be at least 8 characters long.<br>';
            }

            if (!isValid) {
                showToaster('Login failed. Please correct the errors and try again.', 'error');
                errorMessage.innerHTML = validationMessage;
                return;
            }

            const user = users.find(user => user.username === username && user.password === password);

            if (user) {
                localStorage.setItem('loggedInUser', username);
                window.location.href = 'dashboard.html';
            } else {
                showToaster('Login failed. Please try again.', 'error');
                errorMessage.textContent = 'Invalid username or password';
            }
        });
    }

    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('loggedInUser');
            window.location.href = 'index.html';
        });
    }

    const dataForm = document.getElementById('dataForm');
    if (dataForm) {
        dataForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = document.getElementById('name').value.trim();
            const age = document.getElementById('age').value.trim();
            const city = document.getElementById('city').value.trim();
            const country = document.getElementById('country').value.trim();
            const role = document.getElementById('role').value.trim();

            const loggedInUser = localStorage.getItem('loggedInUser');

            if (name && age && city && country && role && loggedInUser) {
                const tableBody = document.querySelector('#dataTable tbody');
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${name}</td>
                    <td>${age}</td>
                    <td>${city}</td>
                    <td>${country}</td>
                    <td>${role}</td>
                `;
                tableBody.appendChild(newRow);
 
                saveTableData(loggedInUser);
                dataForm.reset();
            } else {
                showToaster('Please fill in all fields.', 'error');
            }
        });
    }

    const userIcon = document.getElementById('user-icon');
    const userDetails = document.getElementById('user-details');

    if (userIcon) {
        userIcon.addEventListener('click', () => {
            userDetails.classList.toggle('visible');
        });
    }
});

function showToaster(message = '', type = 'info') {
    const toaster = document.getElementById('toaster');
    const toasterMessage = document.getElementById('toaster-message');
    toasterMessage.textContent = message;
    toaster.className = `show ${type}`;
    
    setTimeout(() => {
        toaster.className = 'hidden';  
    }, 5000);
}

function saveTableData(username) {
    const tableRows = Array.from(document.querySelectorAll('#dataTable tbody tr'));
    const data = tableRows.map(row => {
        const cells = row.querySelectorAll('td');
        return {
            name: cells[0].textContent,
            age: cells[1].textContent,
            city: cells[2].textContent,
            country: cells[3].textContent,
            role: cells[4].textContent
        };
    });
    localStorage.setItem(`tableData_${username}`, JSON.stringify(data));
}

function loadTableData(username) {
    const tableData = localStorage.getItem(`tableData_${username}`);
    if (tableData) {
        const data = JSON.parse(tableData);
        const tableBody = document.querySelector('#dataTable tbody');
        data.forEach(item => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${item.name}</td>
                <td>${item.age}</td>
                <td>${item.city}</td>
                <td>${item.country}</td>
                <td>${item.role}</td>
            `;
            tableBody.appendChild(newRow);
        });
    }
}
