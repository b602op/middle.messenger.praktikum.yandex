import 'mocha';
import * as proxyquire from "proxyquire";
import * as sinon from "sinon";
import { assert } from "chai";
import { ComponentEvent } from "./types";
import { cloneDeep } from '.';

const eventBusMock = {
    on: sinon.fake(),
    emit: sinon.fake()
};

const { Component } = proxyquire(".", {
    "../eventbus": {
        EventBus: class {
            on = eventBusMock.on;
            emit = eventBusMock.emit;
        }
    }
});

interface IComponentMockProps {
    someProp?: string;
}

class ComponentMock extends Component<IComponentMockProps> {
    constructor({ someProp }: IComponentMockProps = {}) {
        super({ someProp });
    }
};

describe("component tests", () => {
    let component: typeof Component;

    before(() => {
        component = new ComponentMock();
    });

    it("should register init event", () => {
        assert.isTrue(eventBusMock.on.calledWith(ComponentEvent.INIT));
    });

    it("should register render event", () => {
        assert.isTrue(eventBusMock.on.calledWith(ComponentEvent.RENDER));
    });

    it("should register component did mount event", () => {
        assert.isTrue(eventBusMock.on.calledWith(ComponentEvent.CDM));
    });

    it("should register component did update event", () => {
        assert.isTrue(eventBusMock.on.calledWith(ComponentEvent.CDU));
    });

    it("should emit init event when component initialized", () => {
        assert.isTrue(eventBusMock.emit.calledWith(ComponentEvent.INIT));
    });

    it("should emit render event when init complete", () => {
        component._init();
        assert.isTrue(eventBusMock.emit.calledWith(ComponentEvent.RENDER));
    });

    it("should emit component did mount event when render complete", () => {
        component._render();
        assert.isTrue(eventBusMock.emit.calledWith(ComponentEvent.CDM));
    });

    it("should emit component did update event when setting props", () => {
        component.setProps({
            someProp: "test"
        });
        assert.isTrue(eventBusMock.emit.calledWith(ComponentEvent.CDU));
    });
});

describe("cloneDeep function tests", () => {
    describe("test cloneDeep when input is object that has only one key without nested", () => {
        let key: string;
        let val: string;
        let expected: Record<string, string>;
        let actual: Record<string, string>;

        beforeEach(() => {
            key = "some-key";
            val = "some-val";
            expected = {
                [key]: val
            };
            actual = cloneDeep(expected) as Record<string, string>;
        });

        it("should return an object that has a different reference than the original", () => {
            assert.notEqual(actual, expected);
        });

        it("should return an object that has same key and value like original one", () => {
            assert.propertyVal(actual, key, val);
        });
    });

    describe("test cloneDeep when input is object that has only one key with nested object that has only one key", () => {
        let key: string;
        let nestedKey: string;
        let val: string;
        let expected: Record<string, Record<string, string>>;
        let actual: Record<string, Record<string, string>>;

        beforeEach(() => {
            key = "some-key";
            nestedKey = "some-nested-key";
            val = "some-val";
            expected = {
                [key]: {
                    [nestedKey]: val
                }
            };
            actual = cloneDeep(expected) as Record<string, Record<string, string>>;
        });

        it("should return an object that has a different reference than the original", () => {
            assert.notEqual(actual, expected);
        });

        it("should return an object that has nested object that has a different reference than the original", () => {
            assert.notEqual(actual[key], expected[key]);
        });

        it("should return an object that has same key like original one", () => {
            assert.property(actual, key);
        });

        it("should return an object that has nested object that has same key and value like original one", () => {
            assert.propertyVal(actual[key], nestedKey, val);
        });
    });
});
