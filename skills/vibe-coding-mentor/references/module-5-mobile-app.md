# Модуль 5: Мобильное приложение для App Store

## Цели модуля
- Выбрать подходящую технологию
- Создать мобильное приложение
- Подготовить к публикации
- Пройти App Review
- Опубликовать в App Store

---

## Урок 5.1: Выбор технологии

### 3 пути создания мобильного приложения

| Подход | Технология | Сложность | Результат |
|--------|------------|-----------|-----------|
| **PWA** | HTML/CSS/JS | ⭐ Легко | Веб-приложение с иконкой |
| **React Native** | JavaScript | ⭐⭐⭐ Средне | Нативное приложение |
| **Swift** | Swift | ⭐⭐⭐⭐⭐ Сложно | Полностью нативное |

### Что выбрать для вайб-кодинга?

**Для быстрого старта: PWA**
- Не нужен аккаунт разработчика ($99/год)
- Работает на всех устройствах
- Можно добавить на домашний экран
- ❌ Нельзя в App Store

**Для App Store: React Native + Expo**
- JavaScript (легче изучить)
- Один код = iOS + Android
- Большое сообщество
- ✅ Публикуется в App Store

---

## Урок 5.2: Создание приложения на React Native

### Шаг 1: Установка Expo

```powershell
# Установи Expo CLI глобально
npm install -g expo-cli

# Создай новый проект
npx create-expo-app my-app --template blank

# Перейди в папку
cd my-app

# Запусти приложение
npx expo start
```

### Шаг 2: Структура проекта

```
my-app/
├── App.js              # Главный компонент
├── app.json            # Конфигурация приложения
├── package.json        # Зависимости
├── assets/             # Иконки, картинки
│   ├── icon.png        # Иконка приложения (1024x1024)
│   └── splash.png      # Экран загрузки
└── src/
    ├── screens/        # Экраны
    ├── components/     # Компоненты
    └── navigation/     # Навигация
```

### Шаг 3: Базовый пример App.js

```javascript
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function App() {
    const [count, setCount] = useState(0);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Моё приложение</Text>
            <Text style={styles.count}>{count}</Text>
            <TouchableOpacity 
                style={styles.button}
                onPress={() => setCount(count + 1)}
            >
                <Text style={styles.buttonText}>Нажми меня</Text>
            </TouchableOpacity>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        color: '#fff',
        marginBottom: 20,
    },
    count: {
        fontSize: 48,
        color: '#e94560',
        fontWeight: 'bold',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#e94560',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});
```

### Шаг 4: Добавление навигации

```powershell
# Установи библиотеки навигации
npx expo install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
```

```javascript
// App.js с навигацией
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Details" component={DetailsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
```

---

## Урок 5.3: Подготовка к публикации

### Требования Apple

| Элемент | Размер/Формат | Описание |
|---------|---------------|----------|
| Иконка | 1024x1024 px, PNG | Без прозрачности! |
| Скриншоты | 6.7" и 5.5" дисплей | Для iPhone 15 и iPhone 8 Plus |
| Описание | 4000 символов макс. | На русском и английском |
| Ключевые слова | 100 символов | Через запятую |
| Политика конфиденциальности | URL | Обязательно! |

### Конфигурация app.json

```json
{
  "expo": {
    "name": "Моё Приложение",
    "slug": "my-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1a1a2e"
    },
    "ios": {
      "bundleIdentifier": "com.yourname.myapp",
      "buildNumber": "1",
      "supportsTablet": false
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon.png",
        "backgroundColor": "#1a1a2e"
      },
      "package": "com.yourname.myapp"
    }
  }
}
```

---

## Урок 5.4: Регистрация Apple Developer

### Шаг 1: Создание Apple ID

Если нет — создай на https://appleid.apple.com

### Шаг 2: Регистрация разработчика

1. Зайди на https://developer.apple.com/programs/
2. Нажми "Enroll"
3. Выбери "Individual"
4. Заполни данные (на английском!)
5. Оплати $99/год

### Шаг 3: Ожидание

- Обычно подтверждение занимает 24-48 часов
- Могут попросить дополнительные документы

---

## Урок 5.5: Сборка и отправка в App Store

### Использование EAS Build (рекомендуется)

```powershell
# Установи EAS CLI
npm install -g eas-cli

# Залогинься в Expo
eas login

# Настрой проект для сборки
eas build:configure

# Собери iOS приложение
eas build --platform ios
```

### Отправка через EAS Submit

```powershell
# Отправь в App Store Connect
eas submit --platform ios
```

### Альтернатива: Через Xcode

1. Скачай проект: `expo prebuild`
2. Открой `ios/MyApp.xcworkspace` в Xcode
3. Product → Archive
4. Distribute App → App Store Connect

---

## Урок 5.6: Прохождение App Review

### Частые причины отказа

| Причина | Решение |
|---------|---------|
| Нет политики конфиденциальности | Добавь страницу и ссылку |
| Приложение падает | Тестируй на реальном устройстве |
| Недостаточный функционал | Добавь уникальные функции |
| Скриншоты не соответствуют | Обнови скриншоты |
| Нет тестового аккаунта | Предоставь логин/пароль |

### Советы для успешного прохождения

1. **Тестируй тщательно** — никаких крашей
2. **Пиши честное описание** — без преувеличений
3. **Добавь инструкцию для ревьюера** — в App Store Connect
4. **Будь готов к вопросам** — отвечай быстро

### Сроки ревью

- Первый раз: 1-3 дня
- Обновления: 12-48 часов
- В праздники: дольше

---

## Урок 5.7: После публикации

### Мониторинг

- **App Analytics** — в App Store Connect
- **Отзывы** — отвечай на негативные
- **Крашлытики** — настрой Sentry или Firebase

### Обновления

```powershell
# Увеличь версию в app.json
# version: "1.0.1"

# Собери и отправь
eas build --platform ios
eas submit --platform ios
```

---

## Практическое задание

Создай простое приложение:

1. **Минимум 3 экрана** с навигацией
2. **Интересный дизайн** (тёмная тема)
3. **Какая-то функциональность** (список, форма, и т.д.)
4. **Подготовь ассеты** (иконка, сплеш)

**Бонус**: Опубликуй в TestFlight для тестирования!

---

## Чек-лист публикации в App Store

- [ ] Зарегистрирован Apple Developer аккаунт
- [ ] Приложение работает без крашей
- [ ] Иконка 1024x1024 px готова
- [ ] Скриншоты для всех размеров
- [ ] Написаны описание и ключевые слова
- [ ] Есть политика конфиденциальности
- [ ] Собран билд через EAS
- [ ] Отправлено в App Store Connect
- [ ] Готов ответить на вопросы ревьюера

---

## Поздравляю! 🎉

Если ты дошёл до этого места и опубликовал приложение — ты молодец!

Теперь у тебя есть:
- Многостраничный сайт
- Интеграция платежей
- Автоматизация с n8n
- Мобильное приложение в App Store

## Что дальше?

- Развивай продукт на основе отзывов
- Добавляй новые функции
- Масштабируй бизнес
- Учись дальше!
