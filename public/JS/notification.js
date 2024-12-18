const notificationContainer = document.getElementById('notificationContainer');

// 서버가 보낸 이벤트 처리 이벤트 생성
const eventSource = new EventSource('/posts/notifications/stream');

eventSource.onmessage = (event) => {
    const comment = JSON.parse(event.data);
    showNotification(`New comment: ${comment.content}`);
}

eventSource.onerror = (event) => {
    console.log('An error occurred about SSE');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-btn" onclick="this.parentElement.remove()">×</button>
    `;

    notificationContainer.appendChild(notification);

    setTimeout(() => notification.remove(), 10000); // 10초 후 사라짐
}

// 서버가 닫힌 경우 연결 닫기
eventSource.addEventListener('close', (event) => {
    eventSource.close();
    console.log('Server closed the connection');
});

// 페이지를 떠날 때 연결 닫기
window.addEventListener('beforeunload', () => {
    if (eventSource) {
        eventSource.close();
        console.log('SSE connection closed');
    }
});