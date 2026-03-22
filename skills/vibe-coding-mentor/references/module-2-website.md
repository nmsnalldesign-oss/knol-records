# Модуль 2: Многостраничный сайт

## Цели модуля
- Создать структуру проекта
- Сделать несколько страниц с навигацией
- Добавить адаптивный дизайн
- Работа с формами
- Опубликовать сайт в интернете

---

## Урок 2.1: Структура проекта

### Правильная организация файлов

```
my-website/
├── index.html          # Главная страница
├── about.html          # О нас
├── products.html       # Каталог товаров
├── contact.html        # Контакты
├── css/
│   └── style.css       # Все стили
├── js/
│   └── main.js         # Вся логика
├── images/
│   ├── logo.png
│   └── products/
│       ├── item1.jpg
│       └── item2.jpg
└── assets/
    └── downloads/      # Файлы для скачивания
```

### Почему это важно?

- **Порядок** — легко найти нужный файл
- **Масштабируемость** — легко добавлять новое
- **Профессионализм** — так делают все

---

## Урок 2.2: Навигация между страницами

### Базовая навигация

```html
<nav class="navbar">
    <div class="logo">
        <a href="index.html">МойБренд</a>
    </div>
    <ul class="nav-links">
        <li><a href="index.html" class="active">Главная</a></li>
        <li><a href="products.html">Каталог</a></li>
        <li><a href="about.html">О нас</a></li>
        <li><a href="contact.html">Контакты</a></li>
    </ul>
    <button class="burger">☰</button>
</nav>
```

### CSS для навигации

```css
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 5%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.nav-links {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-links a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.3s;
}

.nav-links a:hover {
    opacity: 0.8;
}

.nav-links a.active {
    border-bottom: 2px solid white;
}

/* Бургер-меню для мобильных */
.burger {
    display: none;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
}

@media (max-width: 768px) {
    .nav-links {
        display: none;
    }
    .burger {
        display: block;
    }
}
```

### Переиспользуемый блок

Чтобы не копировать навигацию на каждую страницу, можно:

1. **Простой способ** — копировать (для маленьких сайтов)
2. **JavaScript способ** — загружать динамически
3. **Framework способ** — использовать React/Vue (модуль 5)

---

## Урок 2.3: Адаптивный дизайн

### Принцип Mobile First

Сначала делаем дизайн для телефона, потом расширяем для десктопа.

```css
/* Базовые стили (мобильные) */
.container {
    padding: 1rem;
}

.grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
}

/* Планшеты */
@media (min-width: 768px) {
    .container {
        padding: 2rem;
    }
    .grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Десктоп */
@media (min-width: 1024px) {
    .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem 4rem;
    }
    .grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

### Точки перелома (Breakpoints)

| Устройство | Ширина |
|------------|--------|
| Телефон | < 768px |
| Планшет | 768px - 1023px |
| Десктоп | >= 1024px |

### Гибкие изображения

```css
img {
    max-width: 100%;
    height: auto;
}
```

---

## Урок 2.4: Формы и валидация

### Форма обратной связи

```html
<form id="contactForm" class="contact-form">
    <div class="form-group">
        <label for="name">Ваше имя *</label>
        <input type="text" id="name" name="name" required 
               placeholder="Иван Иванов">
    </div>
    
    <div class="form-group">
        <label for="email">Email *</label>
        <input type="email" id="email" name="email" required
               placeholder="ivan@example.com">
    </div>
    
    <div class="form-group">
        <label for="phone">Телефон</label>
        <input type="tel" id="phone" name="phone"
               placeholder="+7 (999) 123-45-67">
    </div>
    
    <div class="form-group">
        <label for="message">Сообщение *</label>
        <textarea id="message" name="message" rows="5" required
                  placeholder="Ваш вопрос..."></textarea>
    </div>
    
    <button type="submit" class="btn-submit">Отправить</button>
</form>
```

### CSS для формы

```css
.contact-form {
    max-width: 500px;
    margin: 0 auto;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

.form-group input,
.form-group textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #667eea;
}

.form-group input:invalid:not(:placeholder-shown) {
    border-color: #ff4444;
}

.btn-submit {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.btn-submit:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
```

### JavaScript для отправки

```javascript
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
        // Отправка на webhook (n8n или другой сервис)
        const response = await fetch('YOUR_WEBHOOK_URL', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            alert('Сообщение отправлено!');
            e.target.reset();
        } else {
            alert('Ошибка отправки');
        }
    } catch (error) {
        alert('Ошибка сети');
    }
});
```

---

## Урок 2.5: Хостинг и домен

### Бесплатные варианты хостинга

| Сервис | Особенности | Для кого |
|--------|-------------|----------|
| **GitHub Pages** | Бесплатно, только статика | Начинающим |
| **Netlify** | Бесплатно, формы, CI/CD | Продвинутым |
| **Vercel** | Бесплатно, отлично для React | Фреймворки |

### Публикация на Netlify (рекомендую)

1. Зайди на https://netlify.com и создай аккаунт
2. Нажми "Add new site" → "Deploy manually"
3. Перетащи папку с сайтом
4. Готово! Получишь URL вида `random-name.netlify.app`

### Свой домен

1. Купи домен (регистраторы: REG.RU, Beget, Timeweb)
2. Цена: от 200₽/год для .ru
3. В Netlify: Settings → Domain management → Add custom domain
4. Настрой DNS записи у регистратора

---

## Практическое задание

Создай сайт с 4 страницами:

1. **Главная** — hero-секция, преимущества, призыв к действию
2. **Каталог** — сетка товаров/услуг с ценами
3. **О нас** — история, команда, миссия
4. **Контакты** — форма + карта + реквизиты

**Требования:**
- Единая навигация на всех страницах
- Адаптивный дизайн (мобильный + десктоп)
- Форма отправляет данные (пока в console.log)
- Красивый дизайн с анимациями

---

## Следующий шаг

После создания сайта переходи к **Модулю 3: Интеграция платежей**.

Скажи AI: "Открой модуль 3 по интеграции платежей"
