export class AdminAuthError extends Error {
    statusCode: number;
    details: any;

    constructor(statusCode: number, message: string, details: any = {}) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Object.setPrototypeOf(this, AdminAuthError.prototype);
    }

    static invalidCredentials(message: string = "Invalid Credentials", details: any = {}) {
        return new AdminAuthError(400, message, details);
    }

    static adminNotFound(details: any = {}) {
        return new AdminAuthError(404,
            `Admin not found`,
            details);
    }

    static adminExists(details: any = {}) {
        return new AdminAuthError(400,
            `Admin already exists`,
            details);
    }

    static cannotCreateAdmin(details: any = {}) {
        return new AdminAuthError(500,
            `An error occurred while creating the Admin`,
            details);
    }
}