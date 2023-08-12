import { assert } from "chai";
import { EventBus, TEventListener } from "."
import * as sinon from "sinon";

describe("EventBus tests", () => {
    it("should has empty listeners when initialized", () => {
        const instance = new EventBus();

        const expected = "{  }";
        const actual = instance.stringify();

        assert.equal(actual, expected);
    });

    it("should add listener on event when called on() method", () => {
        const event: string = "someEvent";
        const listener: TEventListener = (): void => {};
        const EventBusMock = class extends EventBus {
            constructor() {
                super();
                this._listeners = {};
            }
        };
        const instance = new EventBusMock();

        instance.on(event, listener);

        const expected = "{ someEvent: [ [Function: listener] ] }";
        const actual = instance.stringify();

        assert.equal(actual, expected);
    });

    it("should event listener be called once when called emit() method", () => {
        const event: string = "someEvent";
        const listener = sinon.fake();
        const EventBusMock = class extends EventBus {
            constructor() {
                super();
                this._listeners = {
                    [event]: [listener]
                };
            }
        };
        const instance = new EventBusMock();

        instance.emit(event);

        assert.isTrue(listener.calledOnce);
    });

    it("should remove listener from event when call off() method", () => {
        const event: string = "someEvent";
        const listener = (): void => {};
        const EventBusMock = class extends EventBus {
            constructor() {
                super();
                this._listeners = {
                    [event]: [listener]
                };
            }
        };
        const instance = new EventBusMock();

        instance.off(event, listener);

        const expected = "{  }";
        const actual = instance.stringify();

        assert.equal(actual, expected);
    });
});
