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
                daysElement.textContent = '0';
                hoursElement.textContent = '0';
                minutesElement.textContent = '0';
                secondsElement.textContent = '0';
                return;
            }
            
            const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
            
            // Дни
            if (days >= 100) {
                daysElement.textContent = days.toString().padStart(3, '0');
            } else if (days >= 10) {
                daysElement.textContent = days.toString().padStart(2, '0');
            } else {
                daysElement.textContent = days.toString();
            }
            
            // Часы
            if (hours >= 10) {
                hoursElement.textContent = hours.toString().padStart(2, '0');
            } else {
                hoursElement.textContent = hours.toString();
            }
            
            // Минуты
            if (minutes >= 10) {
                minutesElement.textContent = minutes.toString().padStart(2, '0');
            } else {
                minutesElement.textContent = minutes.toString();
            }
            
            // Секунды
            if (seconds >= 10) {
                secondsElement.textContent = seconds.toString().padStart(2, '0');
            } else {
                secondsElement.textContent = seconds.toString();
            }
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
            const thankyouBlock = document.getElementById('thankyouBlock');
            const thankyouDetails = document.getElementById('thankyouDetails');
            const formSubtitle = document.getElementById('formSubtitle');
            
            // Дата дедлайна: 20 мая 2026, 23:59:59
            const DEADLINE_DATE = new Date(2026, 4, 20, 23, 59, 59);
            const now = new Date();
            
            // Проверяем, не прошёл ли дедлайн
            if (now > DEADLINE_DATE) {
                // Скрываем форму
                form.style.display = 'none';
                // Меняем подзаголовок
                if (formSubtitle) {
                    formSubtitle.textContent = 'Сбор подтверждений завершён 20 мая 2026 года';
                }
                // Показываем сообщение
                const closedMessage = document.createElement('div');
                closedMessage.className = 'thankyou-block';
                closedMessage.innerHTML = `
                    <div class="thankyou-content">
                        <div class="thankyou-icon">
                            <i class="fas fa-lock"></i>
                        </div>
                        <h3 class="thankyou-title">Сбор данных завершён</h3>
                        <p class="thankyou-subtitle">Все подтверждения уже собраны</p>
                        <p class="thankyou-note">
                            Если вам необходимо внести изменения, пожалуйста, свяжитесь напрямую с Константином или Еленой.
                        </p>
                    </div>
                `;
                form.parentNode.insertBefore(closedMessage, form.nextSibling);
                return;
            }
            
            // ⚠️ ЭТО ВАША РАБОЧАЯ ССЫЛКА
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyPxycyZMgYdJMX6I8RgY6eR-lxry0-SZP5kPLwQzzgMOECS1CpckrQ7eJhHIthN_mFrA/exec';

            // Функция для отображения блока благодарности
            function showThankYou(formData) {
                // Определяем текст для участия (без иконок, только текст)
                let attendanceHtml = '';
                if (formData.attendance === 'yes') {
                    attendanceHtml = '<span class="thankyou-detail-value yes">Да, с радостью</span>';
                } else {
                    attendanceHtml = '<span class="thankyou-detail-value no">К сожалению, не смогу</span>';
                }
                
                // Форматируем напитки (только текст, без эмодзи)
                let drinksHtml = '';
                if (formData.drinks && formData.drinks.length > 0) {
                    const drinkLabels = {
                        'white_wine': 'Вино белое',
                        'red_wine': 'Вино красное',
                        'champagne': 'Шампанское',
                        'cognac': 'Коньяк',
                        'whiskey': 'Виски',
                        'vodka': 'Водка',
                        'juice': 'Сок',
                        'water': 'Вода'
                    };
                    
                    let drinksList = '<div class="thankyou-drinks-list">';
                    formData.drinks.forEach(drink => {
                        const label = drinkLabels[drink] || drink;
                        drinksList += `<span class="thankyou-drink-tag">${label}</span>`;
                    });
                    drinksList += '</div>';
                    drinksHtml = drinksList;
                } else {
                    drinksHtml = '<span class="thankyou-detail-value">—</span>';
                }
                
                // Формируем HTML с деталями
                thankyouDetails.innerHTML = `
                    <div class="thankyou-detail-row">
                        <span class="thankyou-detail-label">Имя</span>
                        <span class="thankyou-detail-value">${formData.name}</span>
                    </div>
                    <div class="thankyou-detail-row">
                        <span class="thankyou-detail-label">Участие</span>
                        ${attendanceHtml}
                    </div>
                    <div class="thankyou-detail-row">
                        <span class="thankyou-detail-label">Напитки</span>
                        <div class="thankyou-detail-value">${drinksHtml}</div>
                    </div>
                `;
                
                // Прячем форму и показываем блок благодарности
                form.style.display = 'none';
                thankyouBlock.style.display = 'block';
                
                // Плавная прокрутка
                setTimeout(() => {
                    thankyouBlock.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }

            form.addEventListener('submit', async function(e) {
                e.preventDefault();

                // Проверка имени
                const nameInput = document.getElementById('name');
                if (!nameInput.value.trim()) {
                    alert('Пожалуйста, введите имя');
                    return;
                }

                // Проверка участия
                const attendance = document.querySelector('input[name="attendance"]:checked')?.value;
                if (!attendance) {
                    alert('Пожалуйста, укажите, сможете ли вы прийти');
                    return;
                }

                // Собираем напитки
                const drinks = [];
                document.querySelectorAll('input[name="drinks[]"]:checked').forEach(cb => {
                    drinks.push(cb.value);
                });

                // Сохраняем данные
                const formData = {
                    name: nameInput.value.trim(),
                    attendance: attendance,
                    drinks: drinks
                };

                // Меняем кнопку
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Отправка...';
                submitBtn.disabled = true;

                try {
                    // Отправляем данные
                    await fetch(GOOGLE_SCRIPT_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            ...formData,
                            secret_key: 'valerachiter228'
                        })
                    });

                    // Показываем блок благодарности с данными
                    showThankYou(formData);

                } catch (error) {
                    console.error('Ошибка:', error);
                    alert('Ошибка отправки. Попробуйте ещё раз.');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            });
        }
    
    function validateName(input) {
        const value = input.value.trim();
        const nameRegex = /^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/;
        
        if (value && !nameRegex.test(value)) {
            showInputError(input, 'Введите имя и фамилию с заглавной буквы');
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