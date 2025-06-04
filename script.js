// 获取DOM元素
const studyForm = document.getElementById('study-form');
const subjectInput = document.getElementById('subject');
const durationInput = document.getElementById('duration');
const notesInput = document.getElementById('notes');
const historyList = document.getElementById('history-list');
const filterDate = document.getElementById('filter-date');
const currentDateElement = document.getElementById('current-date');

// 云存储相关
const syncBtn = document.getElementById('sync-btn');
const restoreBtn = document.getElementById('restore-btn');
const syncStatus = document.getElementById('sync-status');

// 初始化日期显示
function updateCurrentDate() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        weekday: 'long' 
    };
    currentDateElement.textContent = now.toLocaleDateString('zh-CN', options);
}

// 保存学习记录
function saveStudyRecord(e) {
    e.preventDefault();

    const record = {
        id: Date.now(),
        date: new Date().toISOString(),
        subject: subjectInput.value,
        duration: parseInt(durationInput.value),
        notes: notesInput.value
    };

    // 获取现有记录
    let records = JSON.parse(localStorage.getItem('studyRecords') || '[]');
    records.push(record);
    
    // 保存到localStorage
    localStorage.setItem('studyRecords', JSON.stringify(records));

    // 清空表单
    studyForm.reset();

    // 更新显示
    displayRecords();

    // 显示成功消息
    alert('学习记录已保存！');
}

// 显示学习记录
function displayRecords() {
    const records = JSON.parse(localStorage.getItem('studyRecords') || '[]');
    const filter = filterDate.value;
    
    // 根据筛选条件过滤记录
    let filteredRecords = records;
    if (filter !== 'all') {
        const now = new Date();
        filteredRecords = records.filter(record => {
            const recordDate = new Date(record.date);
            switch(filter) {
                case 'today':
                    return recordDate.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now.setDate(now.getDate() - 7));
                    return recordDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
                    return recordDate >= monthAgo;
                default:
                    return true;
            }
        });
    }

    // 按日期排序（最新的在前）
    filteredRecords.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 清空历史记录列表
    historyList.innerHTML = '';

    // 显示记录
    filteredRecords.forEach(record => {
        const recordDate = new Date(record.date);
        const formattedDate = recordDate.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const recordElement = document.createElement('div');
        recordElement.className = 'history-item';
        recordElement.innerHTML = `
            <h3>${record.subject}</h3>
            <p>学习时长：${record.duration} 分钟</p>
            <p>时间：${formattedDate}</p>
            <p>笔记：${record.notes || '无'}</p>
            <button onclick="deleteRecord(${record.id})" class="delete-btn">删除</button>
        `;
        historyList.appendChild(recordElement);
    });
}

// 删除记录
function deleteRecord(id) {
    if (confirm('确定要删除这条记录吗？')) {
        let records = JSON.parse(localStorage.getItem('studyRecords') || '[]');
        records = records.filter(record => record.id !== id);
        localStorage.setItem('studyRecords', JSON.stringify(records));
        displayRecords();
    }
}

// 同步数据到GitHub
async function syncToGitHub() {
    try {
        syncBtn.disabled = true;
        syncStatus.textContent = '正在保存...';
        syncStatus.className = '';

        // 获取本地数据
        const records = JSON.parse(localStorage.getItem('studyRecords') || '[]');
        const dataStr = JSON.stringify({ records }, null, 2);
        
        // 获取文件SHA（如果存在）
        let sha;
        try {
            const response = await fetch(`https://api.github.com/repos/${config.GITHUB_OWNER}/${config.GITHUB_REPO}/contents/${config.DATA_FILE_PATH}`, {
                headers: {
                    'Authorization': `token ${config.GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                sha = data.sha;
            }
        } catch (error) {
            // 文件不存在，不需要SHA
        }

        // 上传到GitHub
        const response = await fetch(`https://api.github.com/repos/${config.GITHUB_OWNER}/${config.GITHUB_REPO}/contents/${config.DATA_FILE_PATH}`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${config.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: 'Update study records',
                content: btoa(unescape(encodeURIComponent(dataStr))),
                sha: sha
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update GitHub');
        }
        
        syncStatus.textContent = '保存成功';
        syncStatus.className = 'sync-success';
        // 保存最后同步时间
        localStorage.setItem('lastSyncTime', new Date().toISOString());
    } catch (error) {
        console.error('保存失败:', error);
        syncStatus.textContent = '保存失败: ' + error.message;
        syncStatus.className = 'sync-error';
    } finally {
        syncBtn.disabled = false;
    }
}

// 从GitHub恢复数据
async function restoreFromGitHub() {
    try {
        restoreBtn.disabled = true;
        syncStatus.textContent = '正在恢复...';
        syncStatus.className = '';

        const response = await fetch(`https://api.github.com/repos/${config.GITHUB_OWNER}/${config.GITHUB_REPO}/contents/${config.DATA_FILE_PATH}`, {
            headers: {
                'Authorization': `token ${config.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch from GitHub');
        }

        const data = await response.json();
        const content = atob(data.content);
        const records = JSON.parse(content).records;

        // 保存到localStorage
        localStorage.setItem('studyRecords', JSON.stringify(records));
        
        // 更新显示
        displayRecords();
        
        syncStatus.textContent = '恢复成功';
        syncStatus.className = 'sync-success';
    } catch (error) {
        console.error('恢复失败:', error);
        syncStatus.textContent = '恢复失败: ' + error.message;
        syncStatus.className = 'sync-error';
    } finally {
        restoreBtn.disabled = false;
    }
}

// 检查同步状态
function checkSyncStatus() {
    const lastSyncTime = localStorage.getItem('lastSyncTime');
    if (lastSyncTime) {
        const lastSync = new Date(lastSyncTime);
        const now = new Date();
        const diff = now - lastSync;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        
        if (hours < 24) {
            syncStatus.textContent = `上次同步: ${hours}小时前`;
            syncStatus.className = 'sync-success';
        } else {
            syncStatus.textContent = '需要同步';
            syncStatus.className = 'sync-warning';
        }
    } else {
        syncStatus.textContent = '未同步';
        syncStatus.className = 'sync-warning';
    }
}

// 事件监听
studyForm.addEventListener('submit', saveStudyRecord);
filterDate.addEventListener('change', displayRecords);
syncBtn.addEventListener('click', syncToGitHub);
restoreBtn.addEventListener('click', restoreFromGitHub);

// 初始化
updateCurrentDate();
displayRecords();
checkSyncStatus();

// 添加删除按钮样式
const style = document.createElement('style');
style.textContent = `
    .delete-btn {
        background-color: #e74c3c;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 3px;
        cursor: pointer;
        margin-top: 10px;
    }
    .delete-btn:hover {
        background-color: #c0392b;
    }
`;
document.head.appendChild(style); 