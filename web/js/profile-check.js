
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, авторизован ли пользователь
    const currentUserStr = localStorage.getItem('holyfind_current_user');
    
    if (!currentUserStr) {
        // Если пользователь не авторизован, перенаправляем на страницу входа
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const currentUser = JSON.parse(currentUserStr);
        
        // Обновляем данные на странице профиля
        if (currentUser.name) {
            const userNameElement = document.querySelector('.profile-info-card__title');
            if (userNameElement) {
                userNameElement.innerHTML = `Ваше пространство, <span class="profile-info-card__title-line2">${currentUser.name}</span>`;
            }
        }
        
        if (currentUser.email) {
            const userEmailElement = document.querySelector('.profile-info-card__email');
            if (userEmailElement) {
                userEmailElement.textContent = currentUser.email;
            }
        }
    } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
        // В случае ошибки тоже перенаправляем на вход
        window.location.href = 'login.html';
    }
    
    // Обработка кнопки выхода
    const logoutButtons = document.querySelectorAll('.logout-button, .logout-button-mobile');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Удаляем информацию о текущем пользователе
            localStorage.removeItem('holyfind_current_user');
            
            // Перенаправляем на главную страницу
            window.location.href = 'index.html';
        });
    });
});
