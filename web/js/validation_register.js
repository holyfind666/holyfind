
document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const registerButton = document.querySelector('.login-buttonn');
    const form = document.querySelector('form');
    
    const nameError = document.createElement('div');
    nameError.className = 'error-message';
    nameInput.parentNode.insertBefore(nameError, nameInput.nextSibling);
    
    const emailError = document.createElement('div');
    emailError.className = 'error-message';
    emailInput.parentNode.insertBefore(emailError, emailInput.nextSibling);
    
    const passwordError = document.createElement('div');
    passwordError.className = 'error-message';
    passwordInput.parentNode.insertBefore(passwordError, passwordInput.nextSibling);
    
    const confirmPasswordError = document.createElement('div');
    confirmPasswordError.className = 'error-message';
    confirmPasswordInput.parentNode.insertBefore(confirmPasswordError, confirmPasswordInput.nextSibling);

    function validateName(name) {
        name = name.trim();
        if (!name) return 'Введите имя';
        if (name.length < 2) return 'Имя должно содержать минимум 2 символа';
        if (name.length > 50) return 'Имя слишком длинное (макс. 50 символов)';
        return null;
    }

    function validateEmail(email) {
        email = email.trim();
        if (!email) return 'Введите email';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Введите корректный email адрес';
        if (email.length < 11) return 'Email слишком короткий (мин. 11 символов)';
        if (email.length > 50) return 'Email слишком длинный (макс. 50 символов)';
        return null;
    }

    function validatePassword(password) {
        if (!password) return 'Введите пароль';
        if (password.length < 6) return 'Пароль должен содержать минимум 6 символов';
        if (password.length > 25) return 'Пароль слишком длинный (макс. 25 символов)';
        return null;
    }

    function validateConfirmPassword(password, confirmPassword) {
        if (!confirmPassword) return 'Подтвердите пароль';
        if (password !== confirmPassword) return 'Пароли не совпадают';
        return null;
    }

    function updateBorder(input, isValid) {
        input.classList.remove('error', 'success');
        if (isValid === true) input.classList.add('success');
        else if (isValid === false) input.classList.add('error');
    }

    function validateForm() {
        const name = nameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        nameError.textContent = '';
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
        
        updateBorder(nameInput, null);
        updateBorder(emailInput, null);
        updateBorder(passwordInput, null);
        updateBorder(confirmPasswordInput, null);
        
        let isValid = true;
        
        const nameValidation = validateName(name);
        if (nameValidation) {
            nameError.textContent = nameValidation;
            updateBorder(nameInput, false);
            isValid = false;
        } else updateBorder(nameInput, true);
        
        const emailValidation = validateEmail(email);
        if (emailValidation) {
            emailError.textContent = emailValidation;
            updateBorder(emailInput, false);
            isValid = false;
        } else updateBorder(emailInput, true);
        
        const passwordValidation = validatePassword(password);
        if (passwordValidation) {
            passwordError.textContent = passwordValidation;
            updateBorder(passwordInput, false);
            isValid = false;
        } else updateBorder(passwordInput, true);
        
        const confirmPasswordValidation = validateConfirmPassword(password, confirmPassword);
        if (confirmPasswordValidation) {
            confirmPasswordError.textContent = confirmPasswordValidation;
            updateBorder(confirmPasswordInput, false);
            isValid = false;
        } else if (!passwordValidation) updateBorder(confirmPasswordInput, true);
        
        return isValid;
    }

    function handleRegistration(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Сохраняем данные пользователя в localStorage (имитация регистрации)
            const userData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value
            };
            
            // Получаем существующих пользователей или создаем пустой массив
            const users = JSON.parse(localStorage.getItem('holyfind_users')) || [];
            
            // Проверяем, существует ли пользователь с таким email
            const existingUser = users.find(user => user.email === userData.email);
            
            if (existingUser) {
                emailError.textContent = 'Пользователь с таким email уже существует';
                updateBorder(emailInput, false);
                return;
            }
            
            // Добавляем нового пользователя
            users.push(userData);
            localStorage.setItem('holyfind_users', JSON.stringify(users));
            
            // Сохраняем информацию о текущем пользователе
            localStorage.setItem('holyfind_current_user', JSON.stringify({
                name: userData.name,
                email: userData.email,
                isLoggedIn: true
            }));
            
            // Перенаправляем на auth.html после успешной регистрации
            window.location.href = 'auth.html';
        }
    }

    // Назначаем обработчик для формы
    form.addEventListener('submit', handleRegistration);
    
    // Назначаем обработчик для кнопки (на всякий случай)
    registerButton.addEventListener('click', handleRegistration);

    nameInput.addEventListener('blur', () => {
        const error = validateName(nameInput.value);
        if (error) {
            nameError.textContent = error;
            updateBorder(nameInput, false);
        } else {
            nameError.textContent = '';
            updateBorder(nameInput, true);
        }
    });
    
    emailInput.addEventListener('blur', () => {
        const error = validateEmail(emailInput.value);
        if (error) {
            emailError.textContent = error;
            updateBorder(emailInput, false);
        } else {
            emailError.textContent = '';
            updateBorder(emailInput, true);
        }
    });
    
    passwordInput.addEventListener('blur', () => {
        const error = validatePassword(passwordInput.value);
        if (error) {
            passwordError.textContent = error;
            updateBorder(passwordInput, false);
        } else {
            passwordError.textContent = '';
            updateBorder(passwordInput, true);
        }
        
        const confirmError = validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);
        if (confirmError) {
            confirmPasswordError.textContent = confirmError;
            updateBorder(confirmPasswordInput, false);
        } else if (!confirmError && confirmPasswordInput.value) {
            updateBorder(confirmPasswordInput, true);
        }
    });
    
    confirmPasswordInput.addEventListener('blur', () => {
        const error = validateConfirmPassword(passwordInput.value, confirmPasswordInput.value);
        if (error) {
            confirmPasswordError.textContent = error;
            updateBorder(confirmPasswordInput, false);
        } else {
            confirmPasswordError.textContent = '';
            updateBorder(confirmPasswordInput, true);
        }
    });
});
