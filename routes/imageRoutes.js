const express = require('express');
const upload = require(`..${process.env.UPLOAD_PATH}`);
const path = require('path');
const fs = require('fs').promises;

const router = express.Router();

//파일을 전달받은 후
router.post('/', upload.single('image'), async (req, res) => {
    const file = req.file;

    if(!file) return;
    
    const fileName = `${req.body.title}${path.extname(file.originalname)}`;
    const rndName = Date.now();

    if(req.body.title){// 파일 이름을 변경한다.
        await fs.rename(file.path, `${path.dirname(file.path)}/${rndName + '_' + fileName}`);
    }

    res.json({
        title: req.body.title,
        imageUrl: `/uploads/${rndName  + '_' + fileName}`,
    });
});

module.exports = router;