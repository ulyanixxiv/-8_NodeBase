/**
 * Главный файл для использования кастомных модулей
 * Демонстрирует работу всех созданных модулей
 */

const { fetchUsers } = require('./fetch-module');
const { sortStringsIgnoreSpaces, sortObjectsByPropertyIgnoreSpaces } = require('./sort-module');
const fs = require('./fs-module');

async function main() {
    console.log('=== ИСПОЛЬЗОВАНИЕ КАСТОМНЫХ МОДУЛЕЙ ===\n');
    
    try {
        // 1. Загрузка пользователей с JSONPlaceholder
        console.log('1. 📥 ЗАГРУЗКА ПОЛЬЗОВАТЕЛЕЙ С JSONPLACEHOLDER');
        console.log('   Загрузка...');
        
        const usersResult = await fetchUsers();
        
        if (usersResult.error) {
            console.error(`   [ERROR] Ошибка загрузки: ${usersResult.error}`);
            return;
        }
        
        if (usersResult.isLoading) {
            console.log('   [INFO] Данные все еще загружаются...');
            return;
        }
        
        const users = usersResult.data;
        console.log(`   [OK] Загружено пользователей: ${users.length}`);
        
        // 2. Сортировка пользователей по именам (без учета пробелов)
        console.log('\n2. 🔄 СОРТИРОВКА ПОЛЬЗОВАТЕЛЕЙ ПО ИМЕНАМ (без пробелов)');
        
        // Извлекаем имена
        const names = users.map(user => user.name);
        console.log(`   Исходные имена (первые 3): ${names.slice(0, 3).join(', ')}...`);
        
        // Сортируем с помощью нашего модуля
        const sortedNames = sortStringsIgnoreSpaces(names);
        console.log(`   Отсортированные имена (первые 3): ${sortedNames.slice(0, 3).join(', ')}...`);
        
        // Альтернативно: сортировка объектов по свойству name
        const sortedUsers = sortObjectsByPropertyIgnoreSpaces(users, 'name');
        console.log(`   Первый пользователь после сортировки: ${sortedUsers[0]?.name}`);
        
        // 3. Создание структуры папок и файлов
        console.log('\n3. 📁 СОЗДАНИЕ СТРУКТУРЫ ПАПОК И ФАЙЛОВ');
        
        // Создаем папку users
        console.log('   Создание папки users...');
        const dirCreated = fs.createDirSync('users');
        
        if (!dirCreated) {
            console.log('   [WARN] Папка уже существует или ошибка создания');
        }
        
        // Подготавливаем данные для записи
        const userNames = sortedUsers.map(user => user.name);
        const userEmails = sortedUsers.map(user => user.email);
        
        // Форматируем для красивого вывода
        const namesContent = userNames.join('\n');
        const emailsContent = userEmails.join('\n');
        
        // 4. Запись данных в файлы
        console.log('\n4. 💾 ЗАПИСЬ ДАННЫХ В ФАЙЛЫ');
        
        // Записываем имена в names.txt
        console.log('   Запись имен в users/names.txt...');
        const namesWritten = fs.writeFileSync('users/names.txt', namesContent);
        
        if (namesWritten) {
            const stats = fs.readFileSync('users/names.txt');
            console.log(`   [OK] Записано имен: ${userNames.length}`);
            console.log(`   [OK] Размер файла: ${fs.formatFileSize(namesContent.length)}`);
        }
        
        // Записываем email в emails.txt
        console.log('   Запись email в users/emails.txt...');
        const emailsWritten = fs.writeFileSync('users/emails.txt', emailsContent);
        
        if (emailsWritten) {
            console.log(`   [OK] Записано email: ${userEmails.length}`);
        }
        
        // 5. Проверка записи (чтение обратно)
        console.log('\n5. 📖 ПРОВЕРКА ЗАПИСАННЫХ ДАННЫХ');
        
        console.log('   Чтение users/names.txt...');
        const readNames = fs.readFileSync('users/names.txt');
        if (readNames) {
            const lines = readNames.split('\n');
            console.log(`   [OK] Прочитано строк: ${lines.length}`);
            console.log(`   Первые 3 имени: ${lines.slice(0, 3).join(', ')}...`);
        }
        
        console.log('   Чтение users/emails.txt...');
        const readEmails = fs.readFileSync('users/emails.txt');
        if (readEmails) {
            const lines = readEmails.split('\n');
            console.log(`   [OK] Прочитано email: ${lines.length}`);
            console.log(`   Первые 3 email: ${lines.slice(0, 3).join(', ')}...`);
        }
        
        // 6. Дополнительная информация
        console.log('\n6. 📊 ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ');
        
        // Информация о пользователях
        console.log('   Статистика пользователей:');
        console.log(`   • Всего пользователей: ${users.length}`);
        
        // Группировка по доменам email
        const emailDomains = {};
        userEmails.forEach(email => {
            const domain = email.split('@')[1];
            emailDomains[domain] = (emailDomains[domain] || 0) + 1;
        });
        
        console.log(`   • Уникальных доменов email: ${Object.keys(emailDomains).length}`);
        console.log(`   • Самый частый домен: ${Object.entries(emailDomains)
            .sort((a, b) => b[1] - a[1])[0]?.[0]}`);
        
        // Информация о файлах
        console.log('\n   Информация о созданных файлах:');
        const allFiles = fs.getAllFilesSync();
        console.log(`   • Всего файлов в проекте: ${allFiles.length}`);
        console.log(`   • Файлы в папке users: ${allFiles.filter(f => f.includes('users/')).length}`);
        
        console.log('\n' + '='.repeat(60));
        console.log('✅ ВСЕ МОДУЛИ УСПЕШНО ПРОТЕСТИРОВАНЫ!');
        console.log('='.repeat(60));
        
        console.log('\n📁 Созданные файлы:');
        console.log('   • users/names.txt  - имена пользователей');
        console.log('   • users/emails.txt - email пользователей');
        
        console.log('\n🚀 Для просмотра данных откройте файлы в папке users');
        
    } catch (error) {
        console.error('\n❌ КРИТИЧЕСКАЯ ОШИБКА:', error.message);
        console.error('Стек ошибки:', error.stack);
    }
}

// Запуск основной функции
main().catch(error => {
    console.error('Необработанная ошибка:', error);
    process.exit(1);
});