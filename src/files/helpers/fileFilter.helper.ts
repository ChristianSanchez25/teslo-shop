
export const fileFilter = (req : Express.Request, file : Express.Multer.File, cb : Function) => {
    
    if (!file) return cb(new Error('No file provided'), false);

    const fileExtension = file.mimetype.split('/')[1];
    const allowedMimeTypes = ['jpeg', 'png', 'jpg', 'gif'];
    if (!allowedMimeTypes.includes(fileExtension)) {
        return cb(new Error('Invalid file type'), false);
    }
    cb(null, true);
}    