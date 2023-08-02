import { controller } from "../../controllers";
import store, { StorageEvent } from "../Store";

const CHATS_WWS = "wss://ya-praktikum.tech/ws/chats/{userId}/{chatId}/{token}/";

export class Socket {
    private _socket: WebSocket | null;
    private _isConnected: boolean = false;
    private _userId: number | null;
    private _chatId: number | null;
    private _token: string | null;

    disconnect(): void {
        if (this._socket) {
            this._socket.close();
            this._socket = null;
            this._isConnected = false;
            this._userId = null;
            this._chatId = null;
            this._token = null;
            store.off(StorageEvent.UpdateState, this.createSocket.bind(this));
        }
    }

    connect(chatId: number): void {
        this.disconnect();
        this._chatId = chatId;
        store.set("chatsToken", null);
        controller.getToken({ id: chatId });
        if (!store.getState().user) {
            controller.getUser();
        }
        store.on(StorageEvent.UpdateState, this.createSocket.bind(this));
    }

    createSocket(): void {
        const { chatsToken, user } = store.getState();

        const token = chatsToken?.data?.token;

        const userId = user?.data?.id;

        if (this._chatId && token && userId && (this._token !== token || this._userId !== userId)) {
            this._userId = userId;
            this._token = token;
            this._socket = new WebSocket(
                CHATS_WWS
                    .replace("{userId}", userId)
                    .replace("{chatId}", this._chatId.toString())
                    .replace("{token}", token)
            );
            if (this._socket) {
                this._socket.addEventListener("open", () => {
                    this._socket?.send(JSON.stringify({
                        content: "0",
                        type: "get old"
                    }));
                    this._isConnected = true;
                });
                this._socket.addEventListener("close", () => {
                    this._isConnected = false;
                });
                this._socket.addEventListener("message", event => {
                    const data = JSON.parse(event.data);
                    if (data.type === "message") {
                        store.set("messages", [
                            ...store.getState().messages,
                            data
                        ]);
                    } else {
                        if (Array.isArray(data)) {
                            store.set("messages", data.sort(compareMessagesByDate));
                        }
                    }
                });
                this._socket.addEventListener("error", event => {
                    console.log("Ошибка", hasMessage(event) ? event.message : "Неизвестная ошибка");
                });
            }
        }
    }

    sendMessage(message: string): void {
        if (this._isConnected) {
            this._socket?.send(JSON.stringify({
                content: message,
                type: "message"
            }));
        }
    }

    getMessages(): void {
        if (this._isConnected) {
            this._socket?.send(JSON.stringify({
                content: "0",
                type: "get old"
            }));
        }
    }
}

export default new Socket();
