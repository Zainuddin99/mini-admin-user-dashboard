//Custom error class
class customErrorClass extends Error{
    constructor(status, message ){
        super(message),
        this.status = status
    }
}

//Create the instance of above class to identify it is created error using function
const createError = (status, message) =>{
    return new customErrorClass(status, message)
}

module.exports = {customErrorClass, createError}