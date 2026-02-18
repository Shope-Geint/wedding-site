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
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Отправка...';
            submitBtn.disabled = true;
            
            try {
                // Получаем имя
                const nameInput = document.getElementById('name');
                const name = nameInput.value.trim();
                
                // Проверяем имя через функцию валидации
                if (!validateNameInput(nameInput)) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    return;
                }
                
                // Получаем выбранный вариант участия
                const attendanceInput = document.querySelector('input[name="attendance"]:checked');
                if (!attendanceInput) {
                    alert('Пожалуйста, выберите, сможете ли вы присутствовать');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    return;
                }
                
                // Преобразуем значения в читаемый текст
                let attendanceText = '';
                if (attendanceInput.value === 'yes') {
                    attendanceText = '✅ Да, с радостью!';
                } else if (attendanceInput.value === 'no') {
                    attendanceText = '❌ К сожалению, не смогу';
                }
                
                // Получаем выбранные напитки
                const selectedDrinks = [];
                document.querySelectorAll('input[name="drinks[]"]:checked').forEach(checkbox => {
                    // Преобразуем значения в читаемый текст
                    const drinkValue = checkbox.value;
                    if (drinkValue === 'wine') selectedDrinks.push('🍷 Вино');
                    else if (drinkValue === 'champagne') selectedDrinks.push('🥂 Шампанское');
                    else if (drinkValue === 'whiskey') selectedDrinks.push('🥃 Виски');
                    else if (drinkValue === 'vodka') selectedDrinks.push('🥃 Водка');
                    else if (drinkValue === 'juice') selectedDrinks.push('🧃 Сок');
                    else if (drinkValue === 'water') selectedDrinks.push('💧 Вода');
                });
                
                const drinksText = selectedDrinks.length > 0 ? selectedDrinks.join(', ') : 'Не выбраны';
                
                // Формируем сообщение для Telegram
                const message = `
                🎉 <b>НОВЫЙ ОТВЕТ НА СВАДЬБУ!</b>
                ━━━━━━━━━━━━━━━━

                👤 <b>Имя:</b> ${name}

                📌 <b>Участие:</b> ${attendanceText}

                🍷 <b>Напитки:</b> ${drinksText}

                ━━━━━━━━━━━━━━━━
                📅 <b>28 июня 2026</b> | Константин & Елена
                `;
                
                // URL вашего Worker (ЗАМЕНИТЕ НА СВОЙ!)
                const WORKER_URL = 'https://wedding-form-proxy.lohnes98.workers.dev';

                // Отправляем в Worker
                const response = await fetch(WORKER_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: message })
                });
                
                const result = await response.json();
                
                if (result.ok) {
                    alert('Спасибо! Ваш ответ успешно отправлен! Мы скоро подтвердим ваше участие ❤️');
                    
                    // Сбрасываем форму
                    form.reset();
                    
                    // Очищаем ошибки валидации, если были
                    clearInputError(nameInput);
                } else {
                    throw new Error('Ошибка отправки в Telegram');
                }
                
            } catch (error) {
                console.error('Ошибка отправки:', error);
                alert('Извините, произошла ошибка. Пожалуйста, попробуйте еще раз или свяжитесь с нами лично.');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
        
        // Валидация для имени
        const nameInput = document.getElementById('name');
        if (nameInput) {
            nameInput.addEventListener('blur', function() {
                validateNameInput(this);
            });
        }
    }
    
    // Функция валидации имени
    function validateNameInput(input) {
        const value = input.value.trim();
        
        if (value === '') {
            showInputError(input, 'Пожалуйста, введите имя и фамилию');
            return false;
        }
        
        // Проверяем, что введены как минимум два слова
        const words = value.split(' ');
        if (words.length < 2) {
            showInputError(input, 'Пожалуйста, введите имя и фамилию');
            return false;
        }
        
        // Проверяем, что каждое слово начинается с заглавной буквы
        const nameRegex = /^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/;
        if (!nameRegex.test(value)) {
            showInputError(input, 'Введите имя и фамилию с заглавной буквы (например: Иван Иванов)');
            return false;
        }
        
        clearInputError(input);
        return true;
    }
    
    // Функция показа ошибки
    function showInputError(input, message) {
        // Удаляем существующую ошибку, если есть
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
    
    // Функция очистки ошибки
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
        const animatedElements = document.querySelectorAll('.color-item, .location-detail, .timeline-item, .preference-card');
        
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
            document.querySelector('.hero').classList.add('bg-loaded');
        };
        bgImage.onerror = function() {
            console.error('Ошибка загрузки фонового изображения');
            document.querySelector('.hero').style.background = 'var(--white)';
        };
        
        images.forEach(img => {
            img.onerror = function() {
                console.log(`Ошибка загрузки изображения: ${this.src}`);
                this.style.display = 'none';
                
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
            if (!yearElement.textContent.includes('2026')) {
                yearElement.innerHTML += `<br>Создано в ${currentYear}`;
            }
        }
    }
    
    // ===== ПАРАЛЛАКС АНИМАЦИЯ =====
    function initParallaxLines() {
        const parallaxSections = document.querySelectorAll('.program-section, .preferences-section');
        
        if (parallaxSections.length === 0) return;
        
        const parallaxFactors = [
            0.05, 0.08, 0.11, 0.14, 0.17,
            0.20, 0.23, 0.26, 0.29, 0.32,
            0.35, 0.38, 0.41, 0.44, 0.47,
            0.50, 0.53, 0.56, 0.59, 0.62,
            0.65, 0.68, 0.71, 0.74, 0.77,
            0.80, 0.83, 0.86, 0.89, 0.92
        ];

        parallaxSections.forEach(section => {
            const lines = section.querySelectorAll('.line');
            lines.forEach((line, index) => {
                line.style.opacity = '0.2';
            });
        });
        
        function updateParallax() {
            parallaxSections.forEach(section => {
                const lines = section.querySelectorAll('.line');
                const sectionRect = section.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                const sectionHeight = section.offsetHeight;
                
                if (sectionRect.top < windowHeight && sectionRect.bottom > 0) {
                    const sectionTopVisible = Math.max(0, sectionRect.top);
                    const sectionBottomVisible = Math.min(windowHeight, sectionRect.bottom);
                    const visibleHeight = sectionBottomVisible - sectionTopVisible;
                    const visibilityRatio = visibleHeight / windowHeight;
                    
                    lines.forEach((line, index) => {
                        const factor = parallaxFactors[index % parallaxFactors.length];
                        const scrollY = window.scrollY;
                        const sectionOffset = section.offsetTop;
                        const scrollProgress = (scrollY - sectionOffset + windowHeight) / (sectionHeight + windowHeight);
                        
                        const offset = scrollProgress * 100 * factor;
                        
                        if (index % 4 === 0) {
                            line.style.transform = `rotate(${5 + offset * 0.05}deg) translateY(${offset}px)`;
                        } else if (index % 4 === 1) {
                            line.style.transform = `rotate(${-3 - offset * 0.03}deg) translateX(${offset * 0.7}px)`;
                        } else if (index % 4 === 2) {
                            line.style.transform = `rotate(${2 + offset * 0.04}deg) translate(${offset * 0.5}px, ${-offset * 0.3}px)`;
                        } else {
                            line.style.transform = `rotate(${-2 - offset * 0.02}deg) translate(${-offset * 0.4}px, ${offset * 0.6}px)`;
                        }
                        
                        const opacity = 0.15 + (visibilityRatio * 0.25);
                        line.style.opacity = Math.min(0.4, opacity).toString();
                    });
                } else {
                    lines.forEach(line => {
                        line.style.opacity = '0.1';
                    });
                }
            });
        }
        
        updateParallax();
        
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
        
        window.addEventListener('resize', updateParallax);
        
        console.log('Параллакс линии инициализированы');
    }
});