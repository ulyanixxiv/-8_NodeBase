require('dotenv').config();

console.log('=== ПРОВЕРКА РЕЖИМОВ РАБОТЫ ===\n');

// Проверяем, какой файл окружения загружен
const mode = process.env.MODE || 'не указан';
console.log('Текущий режим работы:', mode);
console.log('NODE_ENV:', process.env.NODE_ENV || 'не указан');

// Выводим все переменные окружения (только MODE для безопасности)
console.log('\n=== ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ ===');
for (const key in process.env) {
    if (key.includes('MODE') || key === 'NODE_ENV') {
        console.log(`${key}=${process.env[key]}`);
    }
}

// В зависимости от режима выводим разную информацию
console.log('\n=== ИНФОРМАЦИЯ ДЛЯ РЕЖИМА ===');
switch (mode) {
    case 'development':
        console.log('Режим: Разработка');
        console.log('Рекомендации:');
        console.log('- Включено логирование');
        console.log('- Отключена минификация');
        console.log('- Доступны инструменты отладки');
        break;
    case 'production':
        console.log('Режим: Продакшен');
        console.log('Рекомендации:');
        console.log('- Минимизировать логирование');
        console.log('- Включить кэширование');
        console.log('- Использовать CDN');
        break;
    case 'domain':
        console.log('Режим: Домен');
        console.log('Рекомендации:');
        console.log('- Настроить DNS записи');
        console.log('- Проверить SSL сертификат');
        console.log('- Настроить редиректы');
        break;
    default:
        console.log('Неизвестный режим:', mode);
}

console.log('\n=== ИНФОРМАЦИЯ О ЗАПУСКЕ ===');
console.log('Аргументы командной строки:', process.argv.slice(2));
console.log('Текущая директория:', process.cwd());
console.log('Версия Node.js:', process.version);