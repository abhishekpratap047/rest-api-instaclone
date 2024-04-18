module.exports = (error, req, res, next) =>{
    const status = error.statuscode || 500;
    const message = error.message;
    const data = error.data;
    const validation = error.validation;
    res.status(status).json({
        message,
        data,
        validation
    });
};