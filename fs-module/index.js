const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

/**
 * Форматирует размер файла в читаемый вид
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function logSuccess(message) {
    console.log(`[OK] ${message}`);
}

function logError(message) {
    console.error(`[ERROR] ${message}`);
}

function logWarning(message) {
    console.warn(`[WARN] ${message}`);
}

// ==================== СИНХРОННЫЕ ФУНКЦИИ ====================

// 1. Функция записи в файл (синхронная)
function writeFileSync(filePath, data) {
    try {
        fs.writeFileSync(filePath, data);
        logSuccess(`Файл записан: ${filePath}`);
        return true;
    } catch (error) {
        logError(`Ошибка записи файла ${filePath}: ${error.message}`);
        return false;
    }
}

// 2. Функция чтения из файла (синхронная)
function readFileSync(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        logSuccess(`Файл прочитан: ${filePath} (${formatFileSize(data.length)})`);
        return data;
    } catch (error) {
        logError(`Ошибка чтения файла ${filePath}: ${error.message}`);
        return null;
    }
}

// 3. Функция изменения информации в файле (синхронная)
function updateFileSync(filePath, newData) {
    try {
        fs.writeFileSync(filePath, newData);
        logSuccess(`Файл обновлен: ${filePath}`);
        return true;
    } catch (error) {
        logError(`Ошибка обновления файла ${filePath}: ${error.message}`);
        return false;
    }
}

// 4. Функция удаления информации из файла (синхронная)
function clearFileSync(filePath) {
    try {
        fs.writeFileSync(filePath, '');
        logSuccess(`Файл очищен: ${filePath}`);
        return true;
    } catch (error) {
        logError(`Ошибка очистки файла ${filePath}: ${error.message}`);
        return false;
    }
}

// 5. Функция удаления шума из файла (синхронная)
function cleanFileSync(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        // Удаляем все цифры и переводим в нижний регистр
        const cleanedContent = content
            .replace(/\d+/g, '')        // удаляем цифры
            .toLowerCase();             // переводим в нижний регистр
        
        fs.writeFileSync(filePath, cleanedContent);
        logSuccess(`Файл очищен от шума: ${filePath}`);
        return true;
    } catch (error) {
        logError(`Ошибка очистки файла от шума ${filePath}: ${error.message}`);
        return false;
    }
}

// 6. Функция копирования файла (синхронная)
function copyFileSync(sourcePath, destPath) {
    try {
        const content = fs.readFileSync(sourcePath, 'utf8');
        fs.writeFileSync(destPath, content);
        logSuccess(`Файл скопирован: ${sourcePath} → ${destPath}`);
        return true;
    } catch (error) {
        logError(`Ошибка копирования файла ${sourcePath}: ${error.message}`);
        return false;
    }
}

// 7. Функция создания папки (синхронная)
function createDirSync(dirPath) {
    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            logSuccess(`Папка создана: ${dirPath}`);
            return true;
        } else {
            logWarning(`Папка уже существует: ${dirPath}`);
            return false;
        }
    } catch (error) {
        logError(`Ошибка создания папки ${dirPath}: ${error.message}`);
        return false;
    }
}

// 8. Функция удаления папки (синхронная)
function removeDirSync(dirPath) {
    try {
        if (fs.existsSync(dirPath)) {
            fs.rmSync(dirPath, { recursive: true });
            logSuccess(`Папка удалена: ${dirPath}`);
            return true;
        } else {
            logWarning(`Папка не существует: ${dirPath}`);
            return false;
        }
    } catch (error) {
        logError(`Ошибка удаления папки ${dirPath}: ${error.message}`);
        return false;
    }
}

// 9. Функция получения всех файлов в проекте (синхронная)
function getAllFilesSync(rootPath = '.') {
    const result = [];
    const excludeDirs = ['node_modules', '.git', '.vscode', '.idea'];
    const excludeFiles = ['.env', '.gitignore', 'package-lock.json'];
    
    function scanDirectory(currentPath) {
        try {
            const items = fs.readdirSync(currentPath);
            
            for (const item of items) {
                const fullPath = path.join(currentPath, item);
                
                // Пропускаем исключенные директории
                if (excludeDirs.includes(item)) continue;
                
                try {
                    const stat = fs.statSync(fullPath);
                   if (stat.isDirectory()) {
    scanDirectory(fullPath);
} else {
    // Пропускаем исключенные файлы
    if (!excludeFiles.includes(item) && !item.startsWith('.')) {
        // Используем относительный путь
        const relativePath = path.relative(rootPath, fullPath);
        result.push(relativePath);
    }
}
                } catch (err) {
                    // Пропускаем ошибки доступа
                    continue;
                }
            }
        } catch (error) {
            logError(`Ошибка сканирования директории ${currentPath}: ${error.message}`);
        }
    }
    
    scanDirectory(rootPath);
    logSuccess(`Найдено файлов: ${result.length}`);
    return result;
}

// 10. Функция очистки проекта (синхронная)
function cleanProjectSync() {
    console.log('[INFO] НАЧАЛО ОЧИСТКИ ПРОЕКТА');
    
    const files = getAllFilesSync();
    const excludeDirs = ['node_modules', '.git', '.vscode', '.idea'];
    
    // Удаляем файлы
    let deletedFiles = 0;
    for (const file of files) {
        try {
            fs.unlinkSync(file);
            logSuccess(`Удален файл: ${file}`);
            deletedFiles++;
        } catch (error) {
            logError(`Ошибка удаления файла ${file}: ${error.message}`);
        }
    }
    
    // Удаляем пустые папки
    function removeEmptyDirs(currentPath) {
        try {
            const items = fs.readdirSync(currentPath);
            
            const filteredItems = items.filter(item => 
                !excludeDirs.includes(item) && !item.startsWith('.')
            );
            
            if (filteredItems.length === 0) {
                fs.rmSync(currentPath, { recursive: true });
                logSuccess(`Удалена пустая папка: ${currentPath}`);
                return true;
            }
            
            // Рекурсивно проверяем подпапки
            for (const item of items) {
                const fullPath = path.join(currentPath, item);
                try {
                    const stat = fs.statSync(fullPath);
                    if (stat.isDirectory() && !excludeDirs.includes(item)) {
                        removeEmptyDirs(fullPath);
                    }
                } catch (err) {
                    continue;
                }
            }
            
        } catch (error) {
            // Игнорируем ошибки
        }
        return false;
    }
    
    removeEmptyDirs('.');
    console.log('[INFO] ОЧИСТКА ЗАВЕРШЕНА');
    console.log(`[INFO] Удалено файлов: ${deletedFiles}`);
    return deletedFiles;
}

// ==================== АСИНХРОННЫЕ ФУНКЦИИ ====================

// 1. Функция записи в файл (асинхронная)
async function writeFileAsync(filePath, data) {
    try {
        await fsPromises.writeFile(filePath, data);
        logSuccess(`Файл записан (async): ${filePath}`);
        return true;
    } catch (error) {
        logError(`Ошибка записи файла ${filePath} (async): ${error.message}`);
        return false;
    }
}

// 2. Функция чтения из файла (асинхронная)
async function readFileAsync(filePath) {
    try {
        const data = await fsPromises.readFile(filePath, 'utf8');
        logSuccess(`Файл прочитан (async): ${filePath} (${formatFileSize(data.length)})`);
        return data;
    } catch (error) {
        logError(`Ошибка чтения файла ${filePath} (async): ${error.message}`);
        return null;
    }
}

// 3. Функция изменения информации в файле (асинхронная)
async function updateFileAsync(filePath, newData) {
    try {
        await fsPromises.writeFile(filePath, newData);
        logSuccess(`Файл обновлен (async): ${filePath}`);
        return true;
    } catch (error) {
        logError(`Ошибка обновления файла ${filePath} (async): ${error.message}`);
        return false;
    }
}

// 4. Функция удаления информации из файла (асинхронная)
async function clearFileAsync(filePath) {
    try {
        await fsPromises.writeFile(filePath, '');
        logSuccess(`Файл очищен (async): ${filePath}`);
        return true;
    } catch (error) {
        logError(`Ошибка очистки файла ${filePath} (async): ${error.message}`);
        return false;
    }
}

// 5. Функция удаления шума из файла (асинхронная)
async function cleanFileAsync(filePath) {
    try {
        const content = await fsPromises.readFile(filePath, 'utf8');
        const cleanedContent = content
            .replace(/\d+/g, '')
            .toLowerCase();
        
        await fsPromises.writeFile(filePath, cleanedContent);
        logSuccess(`Файл очищен от шума (async): ${filePath}`);
        return true;
    } catch (error) {
        logError(`Ошибка очистки файла от шума ${filePath} (async): ${error.message}`);
        return false;
    }
}

// 6. Функция копирования файла (асинхронная)
async function copyFileAsync(sourcePath, destPath) {
    try {
        const content = await fsPromises.readFile(sourcePath, 'utf8');
        await fsPromises.writeFile(destPath, content);
        logSuccess(`Файл скопирован (async): ${sourcePath} → ${destPath}`);
        return true;
    } catch (error) {
        logError(`Ошибка копирования файла ${sourcePath} (async): ${error.message}`);
        return false;
    }
}

// 7. Функция создания папки (асинхронная)
async function createDirAsync(dirPath) {
    try {
        await fsPromises.access(dirPath).catch(() => {
            return fsPromises.mkdir(dirPath, { recursive: true });
        });
        logSuccess(`Папка создана (async): ${dirPath}`);
        return true;
    } catch (error) {
        logError(`Ошибка создания папки ${dirPath} (async): ${error.message}`);
        return false;
    }
}

// 8. Функция удаления папки (асинхронная)
async function removeDirAsync(dirPath) {
    try {
        await fsPromises.access(dirPath);
        await fsPromises.rm(dirPath, { recursive: true });
        logSuccess(`Папка удалена (async): ${dirPath}`);
        return true;
    } catch (error) {
        logError(`Ошибка удаления папки ${dirPath} (async): ${error.message}`);
        return false;
    }
}

// 9. Функция получения всех файлов в проекте (асинхронная)
async function getAllFilesAsync(rootPath = '.') {
    const result = [];
    const excludeDirs = ['node_modules', '.git', '.vscode', '.idea'];
    const excludeFiles = ['.env', '.gitignore', 'package-lock.json'];
    
    async function scanDirectory(currentPath) {
        try {
            const items = await fsPromises.readdir(currentPath);
            
            for (const item of items) {
                const fullPath = path.join(currentPath, item);
                
                if (excludeDirs.includes(item)) continue;
                
                try {
                    const stat = await fsPromises.stat(fullPath);
                    
                    if (stat.isDirectory()) {
                        await scanDirectory(fullPath);
                    } else {
                        if (!excludeFiles.includes(item) && !item.startsWith('.')) {
                            result.push(fullPath);
                        }
                    }
                } catch (err) {
                    continue;
                }
            }
        } catch (error) {
            logError(`Ошибка сканирования директории ${currentPath} (async): ${error.message}`);
        }
    }
    
    await scanDirectory(rootPath);
    logSuccess(`Найдено файлов (async): ${result.length}`);
    return result;
}

// 10. Функция очистки проекта (асинхронная)
async function cleanProjectAsync() {
    console.log('[INFO] НАЧАЛО ОЧИСТКИ ПРОЕКТА (async)');
    
    const files = await getAllFilesAsync();
    const excludeDirs = ['node_modules', '.git', '.vscode', '.idea'];
    
    // Удаляем файлы
    let deletedFiles = 0;
    for (const file of files) {
        try {
            await fsPromises.unlink(file);
            logSuccess(`Удален файл (async): ${file}`);
            deletedFiles++;
        } catch (error) {
            logError(`Ошибка удаления файла ${file} (async): ${error.message}`);
        }
    }
    
    // Удаляем пустые папки
    async function removeEmptyDirs(currentPath) {
        try {
            const items = await fsPromises.readdir(currentPath);
            
            const filteredItems = items.filter(item => 
                !excludeDirs.includes(item) && !item.startsWith('.')
            );
            
            if (filteredItems.length === 0) {
                await fsPromises.rm(currentPath, { recursive: true });
                logSuccess(`Удалена пустая папка (async): ${currentPath}`);
                return true;
            }
            
        } catch (error) {
            // Игнорируем ошибки
        }
        return false;
    }
    
    await removeEmptyDirs('.');
    console.log('[INFO] ОЧИСТКА ЗАВЕРШЕНА (async)');
    console.log(`[INFO] Удалено файлов: ${deletedFiles}`);
    return deletedFiles;
}

// ==================== ЭКСПОРТ ФУНКЦИЙ ====================

module.exports = {
    // Синхронные функции
    writeFileSync,
    readFileSync,
    updateFileSync,
    clearFileSync,
    cleanFileSync,
    copyFileSync,
    createDirSync,
    removeDirSync,
    getAllFilesSync,
    cleanProjectSync,
    
    // Асинхронные функции
    writeFileAsync,
    readFileAsync,
    updateFileAsync,
    clearFileAsync,
    cleanFileAsync,
    copyFileAsync,
    createDirAsync,
    removeDirAsync,
    getAllFilesAsync,
    cleanProjectAsync,
    
    // Вспомогательные функции
    formatFileSize,
    logSuccess,
    logError,
    logWarning
};