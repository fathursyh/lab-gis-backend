import multer from 'multer';
const path = require('path');


const storage = multer.diskStorage({
  destination: function (_: any, __: any, cb: any) {
      cb(null, path.join(__dirname, '../../uploads')); // folder tujuan
  },
  filename: function (_: any, file: any, cb: any) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (_req: any, file: any, cb: any) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('invalid-filetype'));
  }
};

export const upload = multer({ storage, fileFilter  });