// 댓글 삭제
async function deleteComment(num) {
    try {
    const res = await fetch(`/posts/<%= post.post_id %>/comment/${num}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json', // 클라이언트가 JSON 응답을 원함을 명시
        },
    });
    const payload = await res.json();

    if(payload.success) {
        window.location.replace('/posts/<%= post.post_id %>');
        //alert('댓글 삭제 완료.');
    }
    else alert(`댓글 삭제 실패: ${payload.error}`);
    
    } catch (error) {
        console.error('오류 발생:', error);
        alert('요청 중 오류가 발생했습니다.');
    }
}