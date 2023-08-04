import { type IMessage } from "../Store";

export const compareMessagesByDate = (lhs: IMessage, rhs: IMessage): number => (
    (lhsTime, rhsTime) => (
        lhsTime < rhsTime
            ? -1
            : lhsTime > rhsTime
                ? 1
                : 0
    )
)(
    new Date(lhs.time).getTime(),
    new Date(rhs.time).getTime()
);

interface IMessageObject {
    message: string;
}

export const hasMessage = (value: unknown): value is IMessageObject => (
    Object.prototype.hasOwnProperty.call(value, "message")
);
