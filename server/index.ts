import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import WebSocket from 'ws';
import { uuid } from 'uuidv4';
import { Player } from './models';
import cors from 'cors';

// Configuration.
dotenv.config();

const port = process.env.PORT as unknown as number;
const sessions = new Map();

//
// WebSocket server.
const ws = new WebSocket.Server({ port: port, path: '/' });
ws.on('connection', (socket, request) => {
    // Receive message.
    const socketKey = request.headers['sec-websocket-key'];
    socket.on('message', (msg) => {
        const json = JSON.parse(msg.toString());
        if (json.event === 'connected') {
            const player = json.data as Player;
            sessions.forEach((value, key) => {
                const p = sessions.get(key).player;
                socket.send(JSON.stringify({ event: "load", data: p }));
                value.socket.send(JSON.stringify({ event: "load", data: player }));
            });
            sessions.set(socketKey, { socket: socket, player: player });
        } else {
            const p = sessions.get(socketKey).player;
            p.position = json.data.position;
            p.rotation = json.data.rotation;
            sessions.forEach((value, key) => {
                if (key !== socketKey) { 
                    value.socket.send(JSON.stringify({ event: "moving", data: p }));
                }
            });
        }
    });

    // disconnect web socket.
    socket.on('close', () => {
        const p = sessions.get(socketKey).player;
        sessions.delete(socketKey);
        sessions.forEach((value) => {
            value.socket.send(JSON.stringify({ event: "disconnect", data: p }));
        });
    })
});

const getPositionAndRotate = () => {
    // This function for only 2 players.
    if (sessions.size === 0) return { position: [0, 0.5, -5], rotation: [0, Math.PI, 0]}
    else return { position: [0, 0.5, 5], rotation: [0, 0, 0]}
}

//
// HTTP server.
const app: Express = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors()) // TODO: Setting correctly

app.post('/join', (req: Request, res: Response) => {
    const id = uuid(); // TODO: Simplify for display "@---"
    const { name, type } = req.body;
    const { position, rotation } = getPositionAndRotate();
    const player: Player = {
        id: id,
        name: name,
        type: type,
        position: position,
        rotation: rotation,
    }    
    res.send(player);
})

app.listen(9000, () => {
    console.log("server Open");
})