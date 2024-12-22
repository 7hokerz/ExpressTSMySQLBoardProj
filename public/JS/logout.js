async function logout() {
    try {
        const res = await fetch('/logout', {
            method: 'GET',
            headers: {
                'Accept': 'application/json', // 클라이언트가 JSON 응답을 원함을 명시
            },
        });
        const payload = await res.json();
    
        if (payload.success) {
            window.location.replace('/login'); // 로그아웃 성공 시 로그인 페이지로 리다이렉트
        } else {
            alert(`로그아웃 실패: ${payload.error}`);
        }
    } catch (error) {
        console.error('오류 발생:', error);
        alert('요청 중 오류가 발생했습니다.');
    }
}
