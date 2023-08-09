// import * as sinon from "sinon";
// import { assert } from "chai";
// import { ComponentEvent } from "./types";
// import { Component } from ".";

// const eventBusMock = {
//     on: sinon.fake(),
//     emit: sinon.fake()
// };

// interface IComponentMockProps {
//     someProp?: string;
// }

// class ComponentMock extends Component<IComponentMockProps> {
//     constructor({ someProp }: IComponentMockProps = {}) {
//         super({ someProp });
//     }
// };

// describe("component tests", () => {
//     let component: typeof Component;

//     before(() => {
//         component = new ComponentMock();
//     });

//     it("should register init event", () => {
//         assert.isTrue(eventBusMock.on.calledWith(ComponentEvent.INIT));
//     });

//     it("should register render event", () => {
//         assert.isTrue(eventBusMock.on.calledWith(ComponentEvent.RENDER));
//     });

//     it("should register component did mount event", () => {
//         assert.isTrue(eventBusMock.on.calledWith(ComponentEvent.CDM));
//     });

//     it("should register component did update event", () => {
//         assert.isTrue(eventBusMock.on.calledWith(ComponentEvent.CDU));
//     });

//     it("should emit init event when component initialized", () => {
//         assert.isTrue(eventBusMock.emit.calledWith(ComponentEvent.INIT));
//     });

//     it("should emit render event when init complete", () => {
//         component._init();
//         assert.isTrue(eventBusMock.emit.calledWith(ComponentEvent.RENDER));
//     });

//     it("should emit component did mount event when render complete", () => {
//         component._render();
//         assert.isTrue(eventBusMock.emit.calledWith(ComponentEvent.CDM));
//     });

//     it("should emit component did update event when setting props", () => {
//         component.setProps({
//             someProp: "test"
//         });
//         assert.isTrue(eventBusMock.emit.calledWith(ComponentEvent.CDU));
//     });
// });
