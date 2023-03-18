class ExpressError extends Error {
    constructor(message, statusCode){
        super()
        this.message = this.message
        this.statusCode = statusCode
    }
}

module.exports = ExpressError