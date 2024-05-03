import * as signalR from '@microsoft/signalr';

export default class SignalrService {
    connection: signalR.HubConnection | null = null;

    onHeartbeat: ((data: any) => void) | undefined;

    async invoke(methodName: string, ...params: any[]) {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
            return await this.connection.invoke(methodName, ...params);
        } else {
            await this.connect();
            return await this.connection?.invoke(methodName, ...params);
        }
    }

    async send(methodName: string, ...params: any[]) {
        if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
            return await this.connection.send(methodName, ...params);
        } else {
            await this.connect();
            return await this.connection?.send(methodName, ...params);
        }
    }

    async connect() {
        const url = process.env.REACT_APP_API_URL as string + '/actionhub';

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(url, {
                accessTokenFactory: () => `${localStorage.getItem('token')}`
            })
            .withAutomaticReconnect()
            .build();

        connection.serverTimeoutInMilliseconds = 1000000;

        connection.on("onHeartbeat", this.onHeartbeatEvent);

        connection.onclose((e) => {
            console.log(e);
        })

        await connection.start().then(() => {
            this.connection = connection;
            if (connection && connection.connectionId) {
                localStorage.setItem("connectionId", connection.connectionId);
            }
        }).catch(reason => console.log(reason.message, reason.stack));
    }

    onHeartbeatEvent = (data: any) => {
        if (this.onHeartbeat) {
            this.onHeartbeat(data);
        }
    }
}