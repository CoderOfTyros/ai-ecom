// error-handling middlewares have 4 params

export function errorHandler(err, req, res, next) {
    // If a response was already sent (e.g. ok: true), we cannot send another error response.
    // Pass the error to Express's default error handler to avoid "Cannot set headers after they are sent to the client".
    // Avoid sending a second response if headers were already sent.
    if (res.headersSent) {
        return next(err);
    }

    const rawStatus = err.statusCode || err.status || 500;

    const status = Number.isInteger(rawStatus) && rawStatus >= 400 && rawStatus <= 599 ?
        rawStatus : 500;

    const isProduction = process.env.NODE_ENV === "production";
    const isServerError = status >= 500;

    const code = err.code || (isServerError ? "INTERNAL_ERROR" : "REQUEST_ERROR");


    const message = isServerError && isProduction ? "Server error" :
        err.message || (isServerError ? "Server error" : "Request error");

    if (isServerError) {
        console.log(err);
    }

    const response = {
        ok: false,
        error: message,
        code
    };

    if (status < 500 && err.details) {
        response.details = err.details;
    }

    return res.status(status).json(response);
}