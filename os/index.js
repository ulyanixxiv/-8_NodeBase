const os = require('os');

function getOSInfo() {
    return {
        platform: os.platform(),
        freeMemory: `${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
        totalMemory: `${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`,
        homeDir: os.homedir(),
        hostname: os.hostname(),
        networkInterfaces: os.networkInterfaces()
    };
}

function hasEnoughMemory() {
    const freeMemoryGB = os.freemem() / 1024 / 1024 / 1024;
    return freeMemoryGB > 4;
}

function checkAccessAndPrint(mode) {
    // Разрешаем все режимы: development, production, domain, user, admin
    const allowedModes = ['development', 'production', 'domain', 'user', 'admin'];
    
    if (allowedModes.includes(mode)) {
        console.log('Информация о ОС:');
        const info = getOSInfo();
        console.log('Платформа:', info.platform);
        console.log('Свободная память:', info.freeMemory);
        console.log('Домашняя директория:', info.homeDir);
        console.log('Имя хоста:', info.hostname);
        console.log('Достаточно ли памяти (>4GB):', hasEnoughMemory() ? 'Да' : 'Нет');
    } else {
        console.log('Доступ запрещен. Неверный режим:', mode);
    }
}

module.exports = {
    getOSInfo,
    hasEnoughMemory,
    checkAccessAndPrint
};