// Устанавливаем кодировку UTF-8 для Windows
if (process.platform === 'win32') {
    const { exec } = require('child_process');
    exec('chcp 65001', (error) => {
        if (error) console.log('Не удалось установить кодировку UTF-8');
    });
}

// index.js - главный файл с поддержкой режимов
const fs = require('fs');
const path = require('path');

console.log('='.repeat(60));
console.log('=== ЛАБОРАТОРНАЯ РАБОТА 8 ===');
console.log('='.repeat(60));

// Определяем режим
const mode = process.env.NODE_ENV || 'development';
console.log(`\nРЕЖИМ: ${mode.toUpperCase()}`);

// Выбираем .env файл
let envFile = `.env.${mode}`;
if (!fs.existsSync(envFile)) {
    envFile = '.env';
}

// Загружаем переменные
require('dotenv').config({ path: envFile });

if (!process.env.MODE) {
    process.env.MODE = mode;
}

console.log(`Файл окружения: ${path.basename(envFile)}`);
console.log(`NODE_ENV: ${mode}`);
console.log(`MODE: ${process.env.MODE}`);

// Разное поведение для режимов
console.log('\n' + '='.repeat(50));
console.log('ИНФОРМАЦИЯ:');

if (mode === 'development') {
    console.log('РАЗРАБОТКА - все данные видны:');
    console.log(`Имя: ${process.env.FIRST_NAME}`);
    console.log(`Фамилия: ${process.env.LAST_NAME}`);
    console.log(`Группа: ${process.env.GROUP_NUMBER}`);
    console.log(`Номер: ${process.env.LIST_NUMBER}`);
} else if (mode === 'production') {
    console.log('ПРОДАКШЕН - данные защищены:');
    console.log(`Имя: ${process.env.FIRST_NAME?.charAt(0)}***`);
    console.log(`Фамилия: ${process.env.LAST_NAME?.charAt(0)}***`);
    console.log(`Группа: скрыто`);
} else if (mode === 'domain') {
    console.log('ДОМЕН - конфигурация развертывания:');
    console.log(`Режим: доменная настройка`);
    console.log(`Пользователь: системный`);
}

// OS модуль
try {
    const os = require('./os');
    console.log('\nИНФОРМАЦИЯ ОС:');
    
    if (mode === 'development') {
        os.checkAccessAndPrint(process.env.MODE);
    } else if (mode === 'production') {
        const hasMemory = os.hasEnoughMemory();
        console.log(`Достаточно памяти: ${hasMemory ? 'Да' : 'Нет'}`);
    } else {
        console.log('Режим домена - ОС готова');
    }
} catch (error) {
    console.log('OS модуль: не загружен');
}

// Сервер
console.log('\n' + '='.repeat(50));
console.log('СЕРВЕР:');

const port = mode === 'development' ? 3000 : 
             mode === 'production' ? 8080 : 8888;

console.log(`Порт: ${port}`);
console.log(`Время: ${new Date().toLocaleTimeString()}`);

const http = require('http');
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    let msg = `ЛР8\nРежим: ${mode}\n`;
    
    if (mode === 'development') msg += 'Разработка\n';
    else if (mode === 'production') msg += 'Продакшен\n';
    else msg += 'Домен\n';
    
    msg += `Время: ${new Date().toLocaleTimeString()}`;
    res.end(msg);
});

server.listen(port, () => {
    console.log(`\nСервер: http://localhost:${port}`);
    console.log(`Остановка: Ctrl+C\n`);
});