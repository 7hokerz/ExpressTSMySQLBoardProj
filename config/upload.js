const multer = require('multer');

// 파일에 대한 제한 지정. 특정 파일(확장자)만 업로드하게 제한을 걸 수 있다.
const fileFilter = (req, file, cb) => {
    const typeArray = file.mimetype.split('/');
    const fileType = typeArray[1];

    if(fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg' || fileType == 'gif' || fileType == 'webp'){
        cb(null, true);
    }
    else{
        cb(new Error('파일 형식이 올바르지 않습니다.'), false);
    }
};

// 파일이 저장되는 위치 및 기본 파일 이름을 지정한다.
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    },
});

const upload = multer({ // 업로드에 대한 최종 설정을 적용하는 부분
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 20 * 1024 * 1024
    }
});

module.exports = upload;