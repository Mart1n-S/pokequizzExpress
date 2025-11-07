export class AppError extends Error {
    public statusCode: number;
    public details?: unknown;

    constructor(message: string, statusCode = 500, details?: unknown) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }

    static Validation(message: string, details?: unknown) {
        return new AppError(message, 400, details);
    }

    static NotFound(message: string, details?: unknown) {
        return new AppError(message, 404, details);
    }

    static Server(message: string, details?: unknown) {
        return new AppError(message, 500, details);
    }
}
