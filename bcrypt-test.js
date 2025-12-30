const bcrypt = require('bcryptjs');
const fs = require('fs').promises;

async function hashPasswords() {
    console.log('=== ХЕШИРОВАНИЕ 13 ПАРОЛЕЙ С BCRYPT ===\n');
    
    // 13 паролей для хеширования (как требуется в задании)
    const passwords = [
        'MySecretPassword123!',
        'Admin@Secure2024',
        'UserPassword456',
        'Test#Crypto789',
        'Winter_Snow2024',
        'Summer_Sun!2025',
        'Autumn_Leaves123',
        'Spring_Flowers456',
        'Qwerty!@#123',
        'Password_Manager789',
        'Secure_Vault2024',
        'Crypto_Wallet123',
        'Final_Password13!'
    ];
    
    console.log('Начинаю хеширование 13 паролей...\n');
    
    const results = [];
    const startTotal = Date.now();
    
    // Хешируем все 13 паролей последовательно
    for (let i = 0; i < passwords.length; i++) {
        const startTime = Date.now();
        
        try {
            // Хешируем пароль с cost factor = 10
            const hash = await bcrypt.hash(passwords[i], 10);
            const endTime = Date.now();
            const elapsedTime = endTime - startTime;
            
            results.push({
                index: i + 1,
                password: passwords[i],
                hash: hash.substring(0, 30) + '...',
                time: elapsedTime
            });
            
            console.log(`Пароль ${i + 1}/${passwords.length}: ${elapsedTime}ms`);
            
        } catch (error) {
            console.error(`Ошибка при хешировании пароля ${i + 1}:`, error.message);
            results.push({
                index: i + 1,
                password: passwords[i],
                hash: 'ОШИБКА',
                time: -1
            });
        }
    }
    
    const totalTime = Date.now() - startTotal;
    
    console.log('\n' + '='.repeat(60));
    console.log('СТАТИСТИКА ХЕШИРОВАНИЯ');
    console.log('='.repeat(60));
    
    // Анализ результатов
    const successfulResults = results.filter(r => r.time > 0);
    
    if (successfulResults.length > 0) {
        const times = successfulResults.map(r => r.time);
        const totalHashTime = times.reduce((a, b) => a + b, 0);
        const averageTime = totalHashTime / times.length;
        const maxTime = Math.max(...times);
        const minTime = Math.min(...times);
        
        console.log('\nОБЩАЯ СТАТИСТИКА:');
        console.log(`Всего паролей: ${passwords.length}`);
        console.log(`Успешно хешировано: ${successfulResults.length}`);
        console.log(`Общее время выполнения: ${totalTime}ms`);
        console.log(`Общее время хеширования: ${totalHashTime}ms`);
        console.log(`Среднее время на пароль: ${averageTime.toFixed(2)}ms`);
        console.log(`Максимальное время: ${maxTime}ms`);
        console.log(`Минимальное время: ${minTime}ms`);
        
        // Находим самый быстрый и самый медленный пароли
        const fastest = successfulResults.find(r => r.time === minTime);
        const slowest = successfulResults.find(r => r.time === maxTime);
        
        console.log(`\nСамый быстрый: пароль ${fastest.index} (${minTime}ms)`);
        console.log(`Самый медленный: пароль ${slowest.index} (${maxTime}ms)`);
        
        // Детальная таблица
        console.log('\n' + '-'.repeat(80));
        console.log('ПОДРОБНЫЕ РЕЗУЛЬТАТЫ:');
        console.log('-'.repeat(80));
        console.log('№  | Время (ms) | Длина пароля | Пароль (первые 20 символов)');
        console.log('-'.repeat(80));
        
        results.forEach(r => {
            const passwordPreview = r.password.length > 20 
                ? r.password.substring(0, 20) + '...' 
                : r.password;
            console.log(
                `${r.index.toString().padStart(2)} | ${r.time.toString().padStart(10)} | ${r.password.length.toString().padStart(12)} | ${passwordPreview}`
            );
        });
        
        // Сохраняем результаты в файл
        try {
            const output = {
                timestamp: new Date().toISOString(),
                totalTime: totalTime,
                statistics: {
                    averageTime: averageTime,
                    maxTime: maxTime,
                    minTime: minTime,
                    totalPasswords: passwords.length,
                    successful: successfulResults.length
                },
                results: results
            };
            
            await fs.writeFile(
                'bcrypt-results.json',
                JSON.stringify(output, null, 2),
                'utf8'
            );
            console.log('\nРезультаты сохранены в файл: bcrypt-results.json');
        } catch (error) {
            console.error('Не удалось сохранить результаты:', error.message);
        }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('АНАЛИЗ И ВЫВОДЫ О ВРЕМЕНИ ХЕШИРОВАНИЯ');
    console.log('='.repeat(80));
    
    console.log('\nПОЧЕМУ ВРЕМЯ ХЕШИРОВАНИЯ РАЗНОЕ ДЛЯ КАЖДОГО ПАРОЛЯ:');
    console.log('\n1. АЛГОРИТМ BCRYPT:');
    console.log('   • Использует адаптивную функцию хеширования');
    console.log('   • Cost factor = 10 означает 2^10 = 1024 итерации');
    console.log('   • Каждая итерация включает операции с памятью и CPU');
    
    console.log('\n2. УНИКАЛЬНАЯ СОЛЬ (SALT):');
    console.log('   • Для каждого пароля генерируется случайная соль');
    console.log('   • Соль добавляется перед хешированием');
    console.log('   • Генерация соли требует дополнительного времени');
    
    console.log('\n3. СИСТЕМНЫЕ ФАКТОРЫ:');
    console.log('   • Загрузка процессора в момент хеширования');
    console.log('   • Работа сборщика мусора в Node.js');
    console.log('   • Конкуренция за ресурсы с другими процессами');
    
    console.log('\n4. EVENT LOOP NODE.JS:');
    console.log('   • Хеширование выполняется в worker pool');
    console.log('   • Event Loop продолжает обрабатывать другие задачи');
    console.log('   • Может происходить переключение контекста');
    
    console.log('\n5. ДЛИНА И СЛОЖНОСТЬ ПАРОЛЯ:');
    console.log('   • Более длинные пароли требуют больше операций');
    console.log('   • Специальные символы могут влиять на обработку');
    console.log('   • Кодировка UTF-8 vs ASCII');
    
    console.log('\n' + '='.repeat(80));
    console.log('ПРАКТИЧЕСКИЕ ВЫВОДЫ:');
    console.log('='.repeat(80));
    
    console.log('\nНОРМАЛЬНЫЕ РЕЗУЛЬТАТЫ:');
    console.log('• Разница в 5-30ms между паролями - это нормально');
    console.log('• Bcrypt специально медленный для защиты от bruteforce');
    console.log('• Время зависит от многих факторов, не только от пароля');
    
    console.log('\nЧТО МОЖЕТ ВЛИЯТЬ НА ВРЕМЯ:');
    console.log('• Количество одновременно запущенных процессов');
    console.log('• Доступная оперативная память');
    console.log('• Версия Node.js и библиотеки bcrypt');
    console.log('• Настройки операционной системы');
    
    console.log('\nРЕКОМЕНДАЦИИ ДЛЯ ПРОИЗВОДСТВА:');
    console.log('• Используйте cost factor 10-12 (баланс безопасности и скорости)');
    console.log('• Кэшируйте хеши для часто используемых паролей');
    console.log('• Мониторьте время хеширования в production');
    console.log('• Тестируйте на production-подобном железе');
    
    console.log('\nЗАКЛЮЧЕНИЕ:');
    console.log('Разное время хеширования - это НЕ ошибка, а особенность');
    console.log('алгоритма bcrypt, которая повышает безопасность системы.');
    console.log('Адаптивность алгоритма делает bruteforce-атаки экономически');
    console.log('невыгодными даже на мощном оборудовании.');
    
    console.log('\n' + '='.repeat(80));
}

// Обработка ошибок и запуск
async function main() {
    try {
        console.log('Проверяю наличие модуля bcryptjs...');
        require.resolve('bcryptjs');
        console.log('Модуль bcryptjs найден\n');
        
        await hashPasswords();
        
        console.log('\nТестирование завершено успешно!');
        console.log('Для просмотра детальных результатов откройте файл bcrypt-results.json');
        
    } catch (error) {
        console.error('\nКРИТИЧЕСКАЯ ОШИБКА:');
        console.error('Не удалось запустить тестирование:', error.message);
        
        if (error.code === 'MODULE_NOT_FOUND') {
            console.error('\nРЕШЕНИЕ: Установите модуль bcryptjs:');
            console.error('npm install bcryptjs');
        }
        
        process.exit(1);
    }
}

// Запуск основной функции
main();