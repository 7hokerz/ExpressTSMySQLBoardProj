
document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);// 폼 데이터를 수집

    // 서버에 파일 업로드 요청
    const response = await fetch('/posts/upload', {
        method: 'POST',
        headers: {
            'Accept': 'application/json', // 클라이언트가 JSON 응답을 원함을 명시
        },
        body: formData,
    });

    const payload = await response.json();
    
    if (payload.success) {// 업로드된 이미지 경로 설정
        window.opener.postMessage({
            type: 'IMAGE_UPLOAD_SUCCESS',
            imageUrl: payload.imageUrl,
            imageId: payload.imageId,
        }, window.location.origin);

        window.close();
    } else {
        alert(`File upload failed: ${payload.error}`);
    }
});