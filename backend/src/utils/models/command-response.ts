export class CommandResponse<T, P = Record<string, any> | Buffer> {
    public type: T;
    public payload?: P;

    constructor(type: T, payload?: P) {
        this.type = type;
        this.payload = payload;
    }
}