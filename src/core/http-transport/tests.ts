import * as sinon from "sinon";
import { HTTPTransport } from ".";
import { expect } from "chai";

let open: any; let send: any; let
    setRequestHeader: any;

describe("HTTPTransport test", () => {
    const _sinon = sinon;

    beforeEach(() => {
        open = _sinon.fake();
        send = _sinon.fake();
        setRequestHeader = _sinon.fake();
    });

    function FakeFormData(): void { }

    (global as any).FormData = FakeFormData;
    (global as any).XMLHttpRequest = function() {
        return {
            x: 123,
            open,
            send,
            setRequestHeader
        } as any;
    };

    it("GET method", () => {
        const http = new HTTPTransport("/user", true);

        http.get("/getUser");

        expect(open.callCount).to.eq(1);
        expect(send.callCount).to.eq(1);

        expect(open.firstArg).to.eq("Get");
        expect(open.lastArg).to.eq("https://ya-praktikum.tech/api/v2/user/getUser");
    });

    it("POST method with query params", () => {
        const http = new HTTPTransport("/user", true);

        http.post("/createUser", { username: "qwe", password: "123456" });

        expect(open.callCount).to.eq(1);
        expect(send.callCount).to.eq(1);

        expect(open.firstArg).to.eq("Post");
        expect(open.lastArg).to.eq("https://ya-praktikum.tech/api/v2/user/createUser");

        expect(send.firstArg).to.eq('{"username":"qwe","password":"123456"}');
    });

    it("delete", () => {
        const http = new HTTPTransport("/user", true);

        http.delete("/test");

        expect(open.callCount).to.eq(1);
        expect(send.callCount).to.eq(1);

        expect(open.firstArg).to.eq("Delete");
        expect(open.lastArg).to.eq("https://ya-praktikum.tech/api/v2/user/test");
    });

    it("send form data", () => {
        const http = new HTTPTransport("/user", true);
        const formData = new FormData();

        http.post("/test", formData);

        expect(open.callCount).to.eq(1);
        expect(send.callCount).to.eq(1);

        expect(open.firstArg).to.eq("Post");
        expect(open.lastArg).to.eq("https://ya-praktikum.tech/api/v2/user/test");
        expect(send.firstArg).to.eq(formData);
    });
});
