const fs = require('fs');
const { execSync } = require('child_process');

// Вспомогательная функция для запуска git-команд прямо из JS
function runGit(command) {
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`Ошибка выполнения команды: ${command}`);
        process.exit(1);
    }
}

console.log('Инициализируем Git репозиторий...');
runGit('git init');
runGit('git branch -M main');

// 1. Генерируем тяжелые бинарные файлы (5 штук по ~85 МБ)
const numberOfFiles = 20;
const fileSizeInBytes = 85 * 1024 * 1024; // 85 MB

console.log(`Генерируем ${numberOfFiles} тяжелых файлов...`);
for (let i = 1; i <= numberOfFiles; i++) {
    const fileName = `large_file_js_00${i}.bin`;
    
    // Создаем буфер со случайными байтами (имитирует реальные неповторяющиеся данные)
    const buffer = Buffer.alloc(fileSizeInBytes);
    // Заполняем случайными числами (Node.js делает это очень быстро через crypto)
    require('crypto').randomFillSync(buffer);
    
    fs.writeFileSync(fileName, buffer);
    console.log(`Файл ${fileName} создан.`);
    
    // Делаем коммит на каждый тяжелый файл
    runGit(`git add ${fileName}`);
    runGit(`git commit -m "Add heavy JS binary file #${i}"`);
}

// 2. Накручиваем историю коммитов (200 штук)
console.log('Накручиваем историю коммитов для теста инкрементального бэкапа...');
const historyFile = 'history_js_test.txt';
fs.writeFileSync(historyFile, 'Start of history\n');

for (let i = 1; i <= 200; i++) {
    fs.appendFileSync(historyFile, `JS Log record number ${i} for BackupLABS stress-test\n`);
    runGit(`git add ${historyFile}`);
    // Использование --allow-empty не нужно, так как файл физически меняется на каждой итерации
    runGit(`git commit -m "Stress test JS commit #${i}"`);
}

console.log('\n=== Готово! Репозиторий успешно создан с помощью Node.js! ===');