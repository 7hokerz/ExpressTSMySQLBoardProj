class PostEditor {
    constructor() {
        this.iframe = document.getElementById('editor');
        this.iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;

        this.iframeDoc.open();
        this.iframeDoc.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <style>
                        body { padding: 20px; }
                    </style>
                </head>
                <body contenteditable="true" >
                    
                </body>
            </html>
        `);
        this.iframeDoc.close();
        this.setupImageUploadListener();
    }

    setupImageUploadListener() {
        document.querySelector('form').addEventListener('submit', async (event) => {
            event.preventDefault();

            const content = await this.convertBase64ImagesToImgTags(this.getContent());
            
            const formData = new FormData();
            formData.append('title', document.getElementById('title').value);
            formData.append('content', content);
            formData.append('imageId', document.getElementById('imageId').value);

            try {
                const res = await fetch('/posts/new', {
                    method: 'POST',
                    body: formData
                });

                const payload = await res.json();
                
                if(payload.success) {
                    window.location.href = '/posts';    
                } else {
                    alert(`게시글 등록 실패: ${payload.error}`);
                }
            } catch (error) { 
                console.error('오류 발생:', error);
                alert('요청 중 오류가 발생했습니다.');
            } 
        });

        window.addEventListener('message', (event) => {
            if(event.origin !== window.location.origin) return;
            
            if(event.data.type === 'IMAGE_UPLOAD_SUCCESS') {
                const { imageUrl, imageId } = event.data;
                this.insertImage(imageUrl);
                document.getElementById('imageId').value = imageId;
            }
        });
    }

    insertImage(url) {
        this.iframeDoc.execCommand('insertImage', false, url);
    }

    getContent() {
        return this.iframeDoc.body.innerHTML;
    }

    setContent(html) {
        this.iframeDoc.body.innerHTML = html;
    }

    async convertBase64ImagesToImgTags(content) {
        const base64Regex = /<img[^>]*src="data:image[^"]*"[^>]*>/g;
        return content.replace(base64Regex, (match) => {
            return `<img src="" id="uploadedImage" style="width: 100%">`;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PostEditor();
});