
async function signup() {
    let id = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    if(id.length < 2 || password.length < 2) {
        alert('아이디와 비밀번호는 2자 이상입니다.');
        return;
    }
    try {
        const res = await fetch('/signup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json', // 클라이언트가 JSON 응답을 원함을 명시
                'Content-Type': 'application/json' // Content-Type을 JSON으로 설정
            },
            body: JSON.stringify({
                username: id, 
                password: btoa(password),
            })
        });
        const payload = await res.json();
        
        if(payload.success) {
            window.location.replace('/login');
        }
        else {
            alert(`회원가입 실패: ${payload.error}`);
        }
    } catch (error) {
        console.error('오류 발생:', error);
        alert('요청 중 오류가 발생했습니다.');
    }

}