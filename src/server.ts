import * as io from 'socket.io';
import * as http from 'http';
import { EventEmitter } from 'events';
import * as express from 'express';
import { Express } from 'express';
import * as cors from 'cors';
import * as q from 'q';
import * as path from "path";

export class Server extends EventEmitter {
    private server: SocketIO.Server;
    private app: Express;
    private httpServer: http.Server;
    private clients: SocketIO.Socket[] = [];
    public buffer : string;
    constructor() {
        super();
    }

    public dispose() {
        this.app = null;
        this.port = null;
        if (this.httpServer) {
            this.httpServer.close();
            this.httpServer = null;
        }
        if (this.server) {
            this.server.close();
            this.server = null;
        }
    }

    private port: number;
    public start(): Promise<number> {
        if (this.port) {
            return Promise.resolve(this.port);
        }
        let def = q.defer();

        this.app = express();
        this.httpServer = http.createServer(this.app);
        this.server = io(this.httpServer);

        let rootDirectory = path.join(__dirname, '..','..','browser');
        this.app.use(express.static(rootDirectory));
        this.app.use(express.static(path.join(__dirname, '..','..','node_modules')));
        this.app.use(cors());
        this.app.get('/', function (_, res) {
            console.log('client fetched /')
             res.sendFile(path.join(rootDirectory, 'index.html'));
        });

        this.httpServer.listen(0, () => {
            this.port = this.httpServer.address().port;
            def.resolve(this.port);
            def = null;
        });
        this.httpServer.on('error', error => {
            if (def) {
                def.reject(error);
            }
        });

        this.server.on('connection', this.onSocketConnection.bind(this));
        return def.promise;
    }

    private onSocketConnection(socket: SocketIO.Socket) {
        this.clients.push(socket);
        socket.on('disconnect', () => {
            const index = this.clients.findIndex(sock => sock.id === socket.id);
            if (index >= 0) {
                this.clients.splice(index, 1);
            }
        });
        this.emit('connected');
        console.log('websocket connected');
        this.sendUpdate(this.buffer);
    }

    public sendUpdate(data) {
        this.clients.forEach(socket => socket.emit('scxml.update', data));
    }

}
