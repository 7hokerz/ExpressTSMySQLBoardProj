document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);// 폼 데이터를 수집

    // 서버에 파일 업로드 요청
    const response = await fetch('/posts/upload', {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();
    console.log(result);
    
    if (response.ok) {// 업로드된 이미지 경로 설정
        const uploadedImage = document.getElementById('uploadedImage');
        uploadedImage.src = result.imageUrl;
        uploadedImage.style.display = 'block'; // 이미지를 화면에 표시
        document.getElementById('imageurl').value = result.imageUrl;
    } else {
        alert('File upload failed.');
    }
});