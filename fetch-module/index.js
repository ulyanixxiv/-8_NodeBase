// Установите node-fetch: npm install node-fetch@2
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function fetchData(url) {
    const result = {
        data: null,
        isLoading: true,
        error: null
    };
    
    try {
        if (!url || typeof url !== 'string') {
            throw new Error('URL должен быть строкой');
        }
        
        console.log(`[fetch-module] Загрузка данных с ${url}`);
        
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ошибка: ${response.status} ${response.statusText}`);
        }
        
        result.data = await response.json();
        console.log(`[fetch-module] Данные успешно загружены`);
        
    } catch (error) {
        result.error = error.message;
        console.error(`[fetch-module] Ошибка: ${error.message}`);
    } finally {
        result.isLoading = false;
    }
    
    return result;
}

async function fetchUsers() {
    return await fetchData('https://jsonplaceholder.typicode.com/users');
}

module.exports = {
    fetchData,
    fetchUsers
};