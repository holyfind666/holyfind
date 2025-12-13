
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginButton = document.querySelector('.login-buttonn');
    const form = document.querySelector('form');
    
    const emailError = document.createElement('div');
    emailError.className = 'error-message';
    emailInput.parentNode.insertBefore(emailError, emailInput.nextSibling);
    
    const passwordError = document.createElement('div');
    passwordError.className = 'error-message';
    passwordInput.parentNode.insertBefore(passwordError, passwordInput.nextSibling);

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

    function updateBorder(input, isValid) {
        input.classList.remove('error', 'success');
        if (isValid === true) input.classList.add('success');
        else if (isValid === false) input.classList.add('error');
    }

    function validateForm() {
        const email = emailInput.value;
        const password = passwordInput.value;
        
        emailError.textContent = '';
        passwordError.textContent = '';
        updateBorder(emailInput, null);
        updateBorder(passwordInput, null);
        
        let isValid = true;
        
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
        
        return isValid;
    }

    function handleLogin(e) {
        e.preventDefault();
        
        if (validateForm()) {
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            // Получаем всех зарегистрированных пользователей
            const users = JSON.parse(localStorage.getItem('holyfind_users')) || [];
            
            // Ищем пользователя с таким email и паролем
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Сохраняем информацию о текущем пользователе
                localStorage.setItem('holyfind_current_user', JSON.stringify({
                    name: user.name,
                    email: user.email,
                    isLoggedIn: true
                }));
                
                // Перенаправляем на auth.html после успешной авторизации
                window.location.href = 'auth.html';
            } else {
                // Если пользователь не найден
                emailError.textContent = 'Неверный email или пароль';
                passwordError.textContent = 'Неверный email или пароль';
                updateBorder(emailInput, false);
                updateBorder(passwordInput, false);
                
                // Очищаем поле пароля
                passwordInput.value = '';
            }
        }
    }

    // Назначаем обработчик для формы
    form.addEventListener('submit', handleLogin);
    
    // Назначаем обработчик для кнопки
    if (loginButton) {
        loginButton.addEventListener('click', handleLogin);
    }

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
    });
    
    // Обработка Enter в полях ввода
    emailInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleLogin(e);
        }
    });
    
    passwordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleLogin(e);
        }
    });
});
