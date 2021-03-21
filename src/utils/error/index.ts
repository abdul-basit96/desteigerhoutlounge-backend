export default class ApiError extends Error {
    constructor(public code : number, public name : string, public message : string) {
        super(message);
    }   
}