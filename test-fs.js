const fs = require('./fs-module');

async function testFSModule() {
    console.log('=== ТЕСТИРОВАНИЕ FS МОДУЛЯ ===\n');
    
    const testDir = 'test-fs-dir';
    const testFile = `${testDir}/test.txt`;
    const testFile2 = `${testDir}/test2.txt`;
    
    try {
        // 1. Создание папки
        console.log('1. Создание папки:');
        fs.createDirSync(testDir);
        
        // 2. Запись в файл
        console.log('\n2. Запись в файл:');
        fs.writeFileSync(testFile, 'Hello World 123 ABC! Привет 456 Мир!');
        
        // 3. Чтение из файла
        console.log('\n3. Чтение из файла:');
        const content = fs.readFileSync(testFile);
        console.log('Содержимое:', content);
        
        // 4. Очистка от шума
        console.log('\n4. Очистка от шума:');
        fs.cleanFileSync(testFile);
        console.log('После очистки:', fs.readFileSync(testFile));
        
        // 5. Копирование файла
        console.log('\n5. Копирование файла:');
        fs.copyFileSync(testFile, testFile2);
        
        // 6. Обновление файла
        console.log('\n6. Обновление файла:');
        fs.updateFileSync(testFile, 'Новое содержимое файла!');
        console.log('Обновленный файл:', fs.readFileSync(testFile));
        
        // 7. Очистка файла
        console.log('\n7. Очистка файла:');
        fs.clearFileSync(testFile);
        console.log('После очистки:', fs.readFileSync(testFile));
        
        // 8. Поиск всех файлов
        console.log('\n8. Поиск всех файлов в проекте:');
        const allFiles = fs.getAllFilesSync();
        console.log('Найдено файлов:', allFiles.length);
        if (allFiles.length > 0) {
            console.log('Первые 3 файла:', allFiles.slice(0, 3));
        }
        
        // 9. Тест асинхронных функций
        console.log('\n9. Тест асинхронных функций:');
        await fs.writeFileAsync(`${testDir}/async-test.txt`, 'Async test');
        const asyncContent = await fs.readFileAsync(`${testDir}/async-test.txt`);
        console.log('Асинхронное чтение:', asyncContent);
        
        // 10. Удаление тестовой папки
        console.log('\n10. Удаление тестовой папки:');
        fs.removeDirSync(testDir);
        
        console.log('\nВсе тесты пройдены успешно!');
        
    } catch (error) {
        console.error('Ошибка тестирования:', error);
    }
}

// Запуск теста
testFSModule();