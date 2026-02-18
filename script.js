// ===== ОСНОВНОЙ КОД =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== ПЕРЕМЕННЫЕ КОНФИГУРАЦИИ =====
    const CONFIG = {
        // Дата свадьбы Константина и Елены (год, месяц-1, день, час, минута)
        WEDDING_DATE: new Date(2026, 5, 28, 16, 0), // 28 июня 2026, 16:00
        FORM_SUBMIT_URL: 'https://formspree.io/f/ваш-form-id',
    };
    
    // ===== ИНИЦИАЛИЗАЦИЯ =====
    init();
    
    function init() {
        // Инициализация всех модулей
        initCountdown();
        initNavigation();
        initForm();
        initScrollTop();
        initColorPalette();
        initScrollAnimations();
        initImageLoading();
        updateFooterYear();
        initParallaxLines();
        
        console.log('Свадебный сайт Константина и Елены инициализирован! 🎉');
    }
    
    // ===== ТАЙМЕР ОБРАТНОГО ОТСЧЕТА =====
    function initCountdown() {
        const daysElement = document.getElementById('days');
        const hoursElement = document.getElementById('hours');
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        
        function updateCountdown() {
            const now = new Date();
            const timeDifference = CONFIG.WEDDING_DATE - now;
            
            if (timeDifference <= 0) {
                daysElement.textContent = '000';
                hoursElement.textContent = '00';
                minutesElement.textContent = '00';
                secondsElement.textContent = '00';
                return;
            }
            
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
            
            daysElement.textContent = days.toString().padStart(3, '0');
            hoursElement.textContent = hours.toString().padStart(2, '0');
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            secondsElement.textContent = seconds.toString().padStart(2, '0');
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    // ===== НАВИГАЦИЯ =====
    function initNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (!navToggle || !navMenu) return;
        
        // Мобильное меню
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Прокрутка с плавным скроллом
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // ===== ФОРМА ПОДТВЕРЖДЕНИЯ =====
function initForm() {
    const form = document.getElementById('weddingForm');
    if (!form) return;
    
    const submitBtn = form.querySelector('.submit-button');
    
    // ЗАМЕНИТЕ ЭТОТ URL НА ВАШ ССЫЛКУ
    const YANDEX_FORM_URL = 'https://forms.yandex.ru/u/6995c666f47e734ccb163534';

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Валидация имени
        if (!validateName(document.getElementById('name'))) {
            alert('Пожалуйста, введите имя и фамилию правильно (Иван Иванов)');
            return;
        }
        
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;
        
        try {
            // Собираем данные
            const formData = new FormData(form);
            
            // Получаем выбранные напитки
            const selectedDrinks = [];
            form.querySelectorAll('input[name="drinks[]"]:checked').forEach(checkbox => {
                selectedDrinks.push(checkbox.value);
            });
            
            // Подготавливаем данные для отправки
            const data = {
                name: formData.get('name').trim(),
                attendance: formData.get('attendance'),
                drinks: selectedDrinks.length > 0 ? selectedDrinks.join(', ') : 'Не указано',
                timestamp: new Date().toISOString()
            };
            
            // Проверяем обязательное поле "Присутствие"
            if (!data.attendance) {
                throw new Error('Пожалуйста, выберите, придете ли вы');
            }
            
            console.log('Отправляемые данные:', data);
            
            // Отправляем в Яндекс Формы
            const formDataToSend = new FormData();
            formDataToSend.append('Имя и фамилия', data.name);
            formDataToSend.append('Вы придёте?', data.attendance === 'yes' ? 'Да, с радостью!' : 'К сожалению, не смогу');
            formDataToSend.append('Какие напитки предпочитаете?', data.drinks);

            const response = await fetch(YANDEX_FORM_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });
            
            // Так как mode: 'no-cors', мы не можем получить response
            // Но если запрос ушел - считаем успешным
            
            // Показываем успешное сообщение
            showSuccessMessage(data);
            
            // Сбрасываем форму
            form.reset();
            
        } catch (error) {
            console.error('Ошибка отправки:', error);
            showErrorMessage(error.message || 'Ошибка отправки формы');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Валидация для имени
    const nameInput = document.getElementById('name');
    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            validateName(this);
        });
    }
    
    // Добавляем обработчик для радио-кнопок
    const radioButtons = form.querySelectorAll('input[name="attendance"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            clearRadioError();
        });
    });
}

    // Функция показа успешного сообщения
    function showSuccessMessage(data) {
        const modal = document.createElement('div');
        modal.className = 'success-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Спасибо, ${data.name.split(' ')[0]}!</h3>
                <p>Ваш ответ успешно сохранён.</p>
                <p>Мы будем ждать вас${data.attendance === 'yes' ? ' с нетерпением' : ' в другой раз'}!</p>
                <button class="modal-close">Закрыть</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Анимация появления
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Закрытие
        modal.querySelector('.modal-close').addEventListener('click', () => {
            closeModal(modal);
        });
        
        // Автозакрытие
        setTimeout(() => {
            if (modal.parentNode) closeModal(modal);
        }, 5000);
    }

    function closeModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            if (modal.parentNode) modal.remove();
        }, 300);
    }

    function showErrorMessage(message) {
        const modal = document.createElement('div');
        modal.className = 'error-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <h3>Ошибка</h3>
                <p>${message}</p>
                <p>Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.</p>
                <button class="modal-close">Понятно</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            closeModal(modal);
        });
    }

    function clearRadioError() {
        const error = document.querySelector('.radio-error');
        if (error) error.remove();
    }

    // Валидация имени (оставляем вашу функцию)
    function validateName(input) {
        const value = input.value.trim();
        const nameRegex = /^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/;
        
        if (value && !nameRegex.test(value)) {
            showInputError(input, 'Введите имя и фамилию с заглавной буквы (например: Иван Иванов)');
            return false;
        } else {
            clearInputError(input);
            return true;
        }
    }

    function showInputError(input, message) {
        clearInputError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'input-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#d32f2f';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '5px';
        
        input.parentNode.appendChild(errorDiv);
        input.style.borderColor = '#d32f2f';
    }

    function clearInputError(input) {
        const existingError = input.parentNode.querySelector('.input-error');
        if (existingError) {
            existingError.remove();
        }
        input.style.borderColor = '';
    }
    
    // ===== КНОПКА "НАВЕРХ" =====
    function initScrollTop() {
        const scrollButton = document.getElementById('scrollTop');
        if (!scrollButton) return;
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                scrollButton.classList.add('visible');
            } else {
                scrollButton.classList.remove('visible');
            }
        });
        
        scrollButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ===== ЦВЕТОВАЯ ПАЛИТРА ДРЕСС-КОДА =====
    function initColorPalette() {
        const colorSwatches = document.querySelectorAll('.color-swatch');
        if (colorSwatches.length === 0) return;
        
        colorSwatches.forEach(swatch => {
            // Показываем RGB код при наведении
            swatch.addEventListener('mouseenter', function() {
                const rgb = getComputedStyle(this).backgroundColor;
                this.setAttribute('title', `Цвет: ${rgb}`);
            });
        });
    }
    
    // ===== АНИМАЦИИ ПРИ ПРОКРУТКЕ =====
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.color-item, .location-detail, .timeline-item, .example-item, .preference-card');
        
        if (animatedElements.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
        
        // Добавляем класс для анимации
        const style = document.createElement('style');
        style.textContent = `
            .animated {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // ===== ОБРАБОТКА ИЗОБРАЖЕНИЙ =====
    function initImageLoading() {
        const images = document.querySelectorAll('img');
        
        // Проверка загрузки фонового изображения
        const bgImage = new Image();
        bgImage.src = 'Image1.jpg';
        bgImage.onload = function() {
            console.log('Фоновое изображение успешно загружено');
            // Можно добавить анимацию появления
            document.querySelector('.hero').classList.add('bg-loaded');
        };
        bgImage.onerror = function() {
            console.error('Ошибка загрузки фонового изображения');
            // Резервный фон
            document.querySelector('.hero').style.background = 'var(--white)';
        };
        
        images.forEach(img => {
            // Добавляем обработчик ошибок загрузки
            img.onerror = function() {
                console.log(`Ошибка загрузки изображения: ${this.src}`);
                this.style.display = 'none';
                
                // Создаем плейсхолдер
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.style.width = '100%';
                placeholder.style.height = '300px';
                placeholder.style.background = 'var(--light)';
                placeholder.style.display = 'flex';
                placeholder.style.alignItems = 'center';
                placeholder.style.justifyContent = 'center';
                placeholder.style.color = 'var(--brown)';
                placeholder.style.border = '2px dashed var(--brown)';
                placeholder.innerHTML = '<i class="fas fa-image"></i>';
                
                this.parentNode.appendChild(placeholder);
            };
            
            // Ленивая загрузка
            if ('loading' in HTMLImageElement.prototype) {
                img.loading = 'lazy';
            }
        });
    }
    
    // ===== ОБНОВЛЕНИЕ ГОДА В ФУТЕРЕ =====
    function updateFooterYear() {
        const yearElement = document.querySelector('.footer-bottom');
        if (yearElement) {
            const currentYear = new Date().getFullYear();
            // Добавляем год создания сайта, если его нет
            if (!yearElement.textContent.includes('2026')) {
                yearElement.innerHTML += `<br>Создано в ${currentYear}`;
            }
        }
    }
    
    // ===== ПАРАЛЛАКС АНИМАЦИЯ =====
function initParallaxLines() {
    const parallaxSections = document.querySelectorAll('.program-section, .preferences-section');
    
    if (parallaxSections.length === 0) return;
    
    // Коэффициенты параллакса для каждого слоя (чем меньше - медленнее)
    
    const parallaxFactors = [
    0.05, 0.08, 0.11, 0.14, 0.17,  // Медленные
    0.20, 0.23, 0.26, 0.29, 0.32,  // Средние
    0.35, 0.38, 0.41, 0.44, 0.47,  // Быстрые
    0.50, 0.53, 0.56, 0.59, 0.62,  // Очень быстрые
    0.65, 0.68, 0.71, 0.74, 0.77,  // Экстра быстрые
    0.80, 0.83, 0.86, 0.89, 0.92   // Супер быстрые
];

    // Инициализация линий
    parallaxSections.forEach(section => {
        const lines = section.querySelectorAll('.line');
        lines.forEach((line, index) => {
            // Устанавливаем начальную прозрачность
            line.style.opacity = '0.2';
        });
    });
    
    // Обработчик скролла
    function updateParallax() {
        parallaxSections.forEach(section => {
            const lines = section.querySelectorAll('.line');
            const sectionRect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const sectionHeight = section.offsetHeight;
            
            // Если секция в зоне видимости
            if (sectionRect.top < windowHeight && sectionRect.bottom > 0) {
                // Вычисляем позицию секции относительно окна (от 0 до 1)
                const sectionTopVisible = Math.max(0, sectionRect.top);
                const sectionBottomVisible = Math.min(windowHeight, sectionRect.bottom);
                const visibleHeight = sectionBottomVisible - sectionTopVisible;
                const visibilityRatio = visibleHeight / windowHeight;
                
                // Применяем параллакс к каждой линии
                lines.forEach((line, index) => {
                    const factor = parallaxFactors[index % parallaxFactors.length];
                    const scrollY = window.scrollY;
                    const sectionOffset = section.offsetTop;
                    const scrollProgress = (scrollY - sectionOffset + windowHeight) / (sectionHeight + windowHeight);
                    
                    // Параллакс движение
                    const offset = scrollProgress * 100 * factor;
                    
                    // Разные направления движения для разных линий
                    if (index % 4 === 0) {
                        // Вертикальное движение
                        line.style.transform = `rotate(${5 + offset * 0.05}deg) translateY(${offset}px)`;
                    } else if (index % 4 === 1) {
                        // Горизонтальное движение
                        line.style.transform = `rotate(${-3 - offset * 0.03}deg) translateX(${offset * 0.7}px)`;
                    } else if (index % 4 === 2) {
                        // Диагональное движение
                        line.style.transform = `rotate(${2 + offset * 0.04}deg) translate(${offset * 0.5}px, ${-offset * 0.3}px)`;
                    } else {
                        // Обратное движение
                        line.style.transform = `rotate(${-2 - offset * 0.02}deg) translate(${-offset * 0.4}px, ${offset * 0.6}px)`;
                    }
                    
                    // Изменение прозрачности в зависимости от видимости
                    const opacity = 0.15 + (visibilityRatio * 0.25);
                    line.style.opacity = Math.min(0.4, opacity).toString();
                });
            } else {
                // Если секция не видна, уменьшаем прозрачность
                lines.forEach(line => {
                    line.style.opacity = '0.1';
                });
            }
        });
    }
    
    // Инициализация
    updateParallax();
    
    // Оптимизированный обработчик скролла с throttling
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Обработчик ресайза
    window.addEventListener('resize', updateParallax);
    
    console.log('Параллакс линии инициализированы');
}
});