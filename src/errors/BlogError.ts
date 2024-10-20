export class BlogError extends Error {
    statusCode: number;
    details: any;

    constructor(statusCode: number, message: string, details: any = {}) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Object.setPrototypeOf(this, BlogError.prototype);
    }

    static cannotCreateBlog() {
        return new BlogError(500, "Cannot Create Blog");
    }

    static cannotDeleteBlog() {
        return new BlogError(500, "Cannot Delete Blog");
    }

    static blogNotFound() {
        return new BlogError(404, "Blog Not Found");
    }
    static unauthorized() {
        return new BlogError(401, "Unauthorized");
    }
    static cannotUpdateBlog() {
        return new BlogError(500, "Cannot Update Blog");
    }
    static seriesNotFound() {
        return new BlogError(404, "Series Not Found");
    }
}