class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); // ovo dodaje message atribut
        this.code = errorCode;
    }
}

module.exports = HttpError;