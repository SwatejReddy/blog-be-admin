export class SeriesError extends Error {
    statusCode: number;
    details: any;

    constructor(statusCode: number, message: string, details: any = {}) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Object.setPrototypeOf(this, SeriesError.prototype);
    }

    static cannotCreateSeries() {
        return new SeriesError(500, "Cannot Create Series");
    }

    static cannotEditSeries() {
        return new SeriesError(500, "Cannot Edit Series");
    }

    static cannotDeleteSeries() {
        return new SeriesError(500, "Cannot Delete Series");
    }

    static seriesHasPosts() {
        return new SeriesError(400, "Series has Posts, cannot delete");
    }

    static seriesNotFound() {
        return new SeriesError(404, "Series Not Found");
    }
}