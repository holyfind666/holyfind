
document.addEventListener('DOMContentLoaded', function() {
    console.log('edit-profile.js загружен');
    
    // ====================
    // ГЛОБАЛЬНЫЕ ЭЛЕМЕНТЫ
    // ====================
    const avatarPopup = document.getElementById('avatarPopup');
    const passwordPopup = document.getElementById('passwordPopup');
    const mainCard = document.getElementById('mainCard');
    const closeButtons = document.querySelectorAll('.close-button');
    
    // ====================
    // ЭЛЕМЕНТЫ ДЛЯ АВАТАРА
    // ====================
    const avatarPreview = document.getElementById('avatarPreview');
    const uploadButton = document.getElementById('uploadAvatarBtn');
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const saveAvatarBtn = document.getElementById('saveAvatarBtn');
    const cancelAvatarBtn = document.getElementById('cancelAvatarBtn');
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.className = 'hidden-file-input';
    
    // Добавляем input для файлов в body
    document.body.appendChild(fileInput);
    
    // ====================
    // ЭЛЕМЕНТЫ ДЛЯ ПАРОЛЯ
    // ====================
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const savePasswordBtn = document.getElementById('savePasswordBtn');
    const cancelPasswordBtn = document.getElementById('cancelPasswordBtn');
    
    // Элементы для ошибок
    const newPasswordError = document.getElementById('newPasswordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    
    // ====================
    // ДРУГИЕ ЭЛЕМЕНТЫ
    // ====================
    const mainAvatar = document.getElementById('mainAvatar');
    const userEmail = document.getElementById('userEmail');
    
    // ====================
    // ФУНКЦИЯ ПОКАЗА ПОПАПОВ
    // ====================
    function showPopup(popupType) {
        console.log('Показать попап:', popupType);
        
        // Скрываем все попапы
        if (avatarPopup) avatarPopup.style.display = 'none';
        if (passwordPopup) passwordPopup.style.display = 'none';
        if (mainCard) mainCard.style.display = 'none';
        
        // Показываем нужный попап
        if (popupType === 'avatar' && avatarPopup) {
            avatarPopup.style.display = 'block';
        } else if (popupType === 'password' && passwordPopup) {
            passwordPopup.style.display = 'block';
        } else if (mainCard) {
            mainCard.style.display = 'block';
        }
        
        // Обновляем URL без перезагрузки
        const newUrl = popupType ? 
            `edit-profile.html?popup=${popupType}` : 
            'edit-profile.html';
        window.history.pushState({}, '', newUrl);
    }
    
    // ====================
    // ЗАГРУЗКА ДАННЫХ ПОЛЬЗОВАТЕЛЯ
    // ====================
    function loadUserData() {
        const currentUserStr = localStorage.getItem('holyfind_current_user');
        
        if (currentUserStr) {
            try {
                const currentUser = JSON.parse(currentUserStr);
                
                // Обновляем email
                if (currentUser.email && userEmail) {
                    userEmail.textContent = currentUser.email;
                }
                
                // Обновляем имя в title (если есть)
                if (currentUser.name) {
                    document.title = `Редактировать профиль (${currentUser.name}) - HOLY FIND`;
                }
                
            } catch (error) {
                console.error('Ошибка загрузки данных пользователя:', error);
            }
        }
    }
    
    // ====================
    // ФУНКЦИОНАЛ ДЛЯ АВАТАРА
    // ====================
    if (uploadButton) {
        uploadButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Клик по кнопке загрузки аватара');
            fileInput.click();
        });
    }
    
    fileInput.addEventListener('change', function(e) {
        if (fileInput.files && fileInput.files[0]) {
            const file = fileInput.files[0];
            
            // Проверяем тип файла
            if (!file.type.match('image.*')) {
                showErrorMessage('Пожалуйста, выберите изображение');
                return;
            }
            
            // Проверяем размер файла (макс 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showErrorMessage('Размер файла не должен превышать 5MB');
                return;
            }
            
            // Создаем превью
            const reader = new FileReader();
            reader.onload = function(e) {
                if (avatarPreview) {
                    avatarPreview.src = e.target.result;
                }
                if (mainAvatar) {
                    mainAvatar.src = e.target.result;
                }
            };
            reader.readAsDataURL(file);
            
            showSuccessMessage('Изображение выбрано успешно!');
        }
    });
    
    if (saveAvatarBtn) {
        saveAvatarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Сохранение аватара');
            
            // Проверяем, выбрано ли изображение
            if (!fileInput.files || !fileInput.files[0]) {
                showErrorMessage('Пожалуйста, выберите изображение');
                return;
            }
            
            // В реальном проекте здесь была бы загрузка на сервер
            // Для демо просто показываем сообщение
            showSuccessMessage('Аватар успешно обновлен!');
            
            // Через 1 секунду возвращаемся на главную карточку
            setTimeout(() => {
                showPopup('main');
            }, 1000);
        });
    }
    
    // ====================
    // ВАЛИДАЦИЯ ПАРОЛЯ
    // ====================
    function validatePassword() {
        const newPassword = newPasswordInput ? newPasswordInput.value : '';
        const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';
        
        // Сбрасываем ошибки
        if (newPasswordError) newPasswordError.textContent = '';
        if (confirmPasswordError) confirmPasswordError.textContent = '';
        
        if (newPasswordInput) {
            newPasswordInput.classList.remove('error', 'success');
        }
        if (confirmPasswordInput) {
            confirmPasswordInput.classList.remove('error', 'success');
        }
        
        let isValid = true;
        
        // Проверка нового пароля
        if (!newPassword) {
            if (newPasswordError) newPasswordError.textContent = 'Введите новый пароль';
            if (newPasswordInput) newPasswordInput.classList.add('error');
            isValid = false;
        } else if (newPassword.length < 6) {
            if (newPasswordError) newPasswordError.textContent = 'Пароль должен содержать минимум 6 символов';
            if (newPasswordInput) newPasswordInput.classList.add('error');
            isValid = false;
        } else if (newPassword.length > 25) {
            if (newPasswordError) newPasswordError.textContent = 'Пароль слишком длинный (макс. 25 символов)';
            if (newPasswordInput) newPasswordInput.classList.add('error');
            isValid = false;
        } else if (newPasswordInput) {
            newPasswordInput.classList.add('success');
        }
        
        // Проверка подтверждения пароля
        if (!confirmPassword) {
            if (confirmPasswordError) confirmPasswordError.textContent = 'Подтвердите пароль';
            if (confirmPasswordInput) confirmPasswordInput.classList.add('error');
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            if (confirmPasswordError) confirmPasswordError.textContent = 'Пароли не совпадают';
            if (confirmPasswordInput) confirmPasswordInput.classList.add('error');
            isValid = false;
        } else if (confirmPasswordInput) {
            confirmPasswordInput.classList.add('success');
        }
        
        return isValid;
    }
    
    // ====================
    // СОХРАНЕНИЕ ПАРОЛЯ
    // ====================
    function savePassword() {
        if (!validatePassword()) {
            return;
        }
        
        const newPassword = newPasswordInput.value;
        
        // Получаем текущего пользователя
        const currentUserStr = localStorage.getItem('holyfind_current_user');
        if (!currentUserStr) {
            showErrorMessage('Пользователь не найден. Пожалуйста, войдите заново.');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }
        
        try {
            const currentUser = JSON.parse(currentUserStr);
            const userEmail = currentUser.email;
            
            // Получаем всех пользователей
            const users = JSON.parse(localStorage.getItem('holyfind_users')) || [];
            
            // Находим текущего пользователя
            const userIndex = users.findIndex(user => user.email === userEmail);
            
            if (userIndex !== -1) {
                // Обновляем пароль
                users[userIndex].password = newPassword;
                
                // Сохраняем обновленных пользователей
                localStorage.setItem('holyfind_users', JSON.stringify(users));
                
                // Показываем сообщение об успехе
                showSuccessMessage('Пароль успешно изменен!');
                
                // Очищаем поля
                if (newPasswordInput) newPasswordInput.value = '';
                if (confirmPasswordInput) confirmPasswordInput.value = '';
                
                // Через 1 секунду возвращаемся на главную карточку
                setTimeout(() => {
                    showPopup('main');
                }, 1000);
            } else {
                showErrorMessage('Ошибка: пользователь не найден в базе данных');
            }
        } catch (error) {
            console.error('Ошибка при сохранении пароля:', error);
            showErrorMessage('Произошла ошибка при сохранении пароля');
        }
    }
    
    if (savePasswordBtn) {
        savePasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Изменение пароля');
            savePassword();
        });
    }
    
    // ====================
    // ПОКАЗ СООБЩЕНИЙ
    // ====================
    function showSuccessMessage(message) {
        // Создаем элемент для сообщения
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 15px 25px;
                border-radius: 4px;
                font-family: 'crimsonpro', serif;
                font-size: 16px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideIn 0.3s ease;
            ">
                ${message}
            </div>
        `;
        
        document.body.appendChild(successMessage);
        
        // Удаляем сообщение через 3 секунды
        setTimeout(() => {
            successMessage.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (successMessage.parentNode) {
                    document.body.removeChild(successMessage);
                }
            }, 300);
        }, 3000);
    }
    
    function showErrorMessage(message) {
        // Создаем элемент для сообщения
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message-global';
        errorMessage.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ff6b6b;
                color: white;
                padding: 15px 25px;
                border-radius: 4px;
                font-family: 'crimsonpro', serif;
                font-size: 16px;
                z-index: 10000;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideIn 0.3s ease;
            ">
                ${message}
            </div>
        `;
        
        document.body.appendChild(errorMessage);
        
        // Удаляем сообщение через 3 секунды
        setTimeout(() => {
            errorMessage.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (errorMessage.parentNode) {
                    document.body.removeChild(errorMessage);
                }
            }, 300);
        }, 3000);
    }
    
    // ====================
    // НАЗНАЧЕНИЕ СОБЫТИЙ
    // ====================
    
    // Кнопка изменения аватарки на главной карточке
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Клик по "Добавить фото"');
            showPopup('avatar');
        });
    }
    
    // Кнопка изменения пароля на главной карточке
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Клик по "Изменить пароль"');
            showPopup('password');
        });
    }
    
    // Кнопки отмены
    if (cancelAvatarBtn) {
        cancelAvatarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Отмена изменения аватара');
            showPopup('main');
        });
    }
    
    if (cancelPasswordBtn) {
        cancelPasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Отмена изменения пароля');
            showPopup('main');
        });
    }
    
    // Закрытие по кнопкам закрытия
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Закрытие попапа');
            
            if (this.getAttribute('href') === 'profile.html') {
                // Если это кнопка закрытия на главной карточке, идем в профиль
                window.location.href = 'profile.html';
            } else {
                // Иначе показываем главную карточку
                showPopup('main');
            }
        });
    });
    
    // Валидация пароля при вводе
    if (newPasswordInput) {
        newPasswordInput.addEventListener('blur', function() {
            validatePassword();
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('blur', function() {
            validatePassword();
        });
    }
    
    // Обработка Enter в полях пароля
    if (newPasswordInput) {
        newPasswordInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                savePassword();
            }
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                savePassword();
            }
        });
    }
    
    // ====================
    // ИНИЦИАЛИЗАЦИЯ
    // ====================
    
    // Проверяем параметры URL при загрузке
    const urlParams = new URLSearchParams(window.location.search);
    const popupType = urlParams.get('popup');
    
    // Загружаем данные пользователя
    loadUserData();
    
    // Показываем нужный попап
    showPopup(popupType || 'main');
    
    // Добавляем CSS для анимаций, если еще нет
    if (!document.querySelector('#animation-styles')) {
        const animationStyles = document.createElement('style');
        animationStyles.id = 'animation-styles';
        animationStyles.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(animationStyles);
    }
    
    console.log('edit-profile.js инициализирован');
});
