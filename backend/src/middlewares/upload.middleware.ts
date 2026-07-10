import multer from 'multer';
import path from 'path';
import { UPLOAD } from '../constants';
import ApiError from '../utils/apiError';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = [
    ...UPLOAD.ALLOWED_IMAGE_TYPES,
    ...UPLOAD.ALLOWED_FILE_TYPES,
  ];

  if ((allowedTypes as string[]).includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `File type ${file.mimetype} is not allowed`) as any);
  }
};

export const uploadSingle = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: UPLOAD.MAX_FILE_SIZE,
  },
}).single('file');

export const uploadProfileImage = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if ((UPLOAD.ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new ApiError(400, 'Only image files are allowed for profile') as any);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB for profile images
  },
}).single('image');
