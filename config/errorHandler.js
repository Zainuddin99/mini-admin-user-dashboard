module.exports.errorHandler = async(err, req, res, next) =>{
    console.log(err?.message || err);
    res.status(err?.status || 500).json({message: err.message || 'Something went wrong!'});
}