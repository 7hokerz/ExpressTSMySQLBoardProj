const LikeStatus = {
    LIKED: 'LIKED',
    NOT_LIKED: 'NOT_LIKED'
};

class LikeManager {
    constructor() {
        this.elements = {
            button: document.getElementById('like-button'), // 좋아요 버튼
            counter: document.getElementById('like_count'), // 좋아요 개수
        };
        this.state = this.initializeState();
        this.init();
    }
    
    initializeState() {
        return {
            likeCount: parseInt(this.elements.counter.textContent),
            status: this.elements.button.dataset.likeStatus,
            postId: this.elements.button.dataset.postId
        }
    }

    init() {
        this.updateButtonStyle();
        this.addEvents();
    }

    addEvents() {
        document.addEventListener('click', this.handleClick);
    }

    handleClick = async (e) => {
        if(!e.target.matches('#like-button')) return;

        this.setLoading(true); //await this.wait(1000);
        try {
            const res = await fetch(`/posts/${this.state.postId}/like`, {
                method: `${this.state.status === LikeStatus.LIKED ? 'DELETE' : 'POST'}`,
                headers: {
                    'Accept': 'application/json',
                }
            });
            const payload = await res.json();
            
            if(payload.success) {
                const newStatus = this.state.status === LikeStatus.LIKED 
                    ? LikeStatus.NOT_LIKED : LikeStatus.LIKED;
                this.updateLikeUI(newStatus);
            }
            else {
                alert(`좋아요 실패: ${payload.error}`);
            }
        } catch (error) { 
            console.error('오류 발생:', error);
            alert('요청 중 오류가 발생했습니다.');
        } finally {
            this.setLoading(false);
        }
    }

    updateLikeUI(status) {
        // 객체 상태에 적용
        this.state.status = status;
        this.state.likeCount += (status === LikeStatus.LIKED ? 1 : -1);

        // HTML 요소에 적용
        this.elements.button.dataset.likeStatus = status;
        this.updateButtonStyle();
        this.elements.counter.textContent = this.state.likeCount;
    }

    updateButtonStyle() {
        this.elements.button.classList.toggle('liked', 
            this.state.status === LikeStatus.LIKED);
    }

    setLoading(isLoading) {
        this.elements.button.disabled = isLoading;
        this.elements.button.classList.toggle('loading', isLoading);
    }

    // 시간 지연 함수(setTimeout은 비동기 함수이지만 프로미스 객체를 반환하지 않아 아래 형태로 구현)
    wait = (time) => new Promise((resolve) => setTimeout(resolve, time));
}

// 사용
document.addEventListener('DOMContentLoaded', () => {
    new LikeManager();
});