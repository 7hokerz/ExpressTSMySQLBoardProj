
export interface ApiResponse<T> {
    success: boolean;
    data?: T; 
    error?: string; // 에러
    message?: string; // 에러 메시지
}