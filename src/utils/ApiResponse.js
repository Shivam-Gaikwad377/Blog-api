class ApiResponse {
    constructor(data, statusCode, message = 'Success', success) {
        this.data = data;
        this.statusCode = statusCode;
        this.message = message;
        this.success = statusCode < 400;
    }
}