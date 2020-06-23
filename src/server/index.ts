import { createServer } from "http";
import express from "express";
import WebSocket from "ws";
import './polyfill';
import store from "./store";
import {newConnection} from "./store/actions";

const app = express();

const port = process.env.PORT || 5000;
const server = createServer(app);

const webSocketServer = new WebSocket.Server({
	server,
	perMessageDeflate: {
		zlibDeflateOptions: {
			// See zlib defaults.
			chunkSize: 1024,
			memLevel: 7,
			level: 3
		},
		zlibInflateOptions: {
			chunkSize: 10 * 1024
		},
		// Other options settable:
		clientNoContextTakeover: true, // Defaults to negotiated value.
		serverNoContextTakeover: true, // Defaults to negotiated value.
		serverMaxWindowBits: 10, // Defaults to negotiated value.
		// Below options specified as default values.
		concurrencyLimit: 10, // Limits zlib concurrency for perf.
		threshold: 1024 // Size (in bytes) below which messages
		// should not be compressed.
	}
});
webSocketServer.on("connection", (webSocket, req) => {
	if (!req.url) {
		throw new Error('Request missing url');
	}
	if (!req.socket.remoteAddress) {
		throw new Error('Request missing req.socket.remoteAddress');
	}
	store.dispatch(newConnection(webSocket, req.url, req.socket.remoteAddress));
});

server.listen(port, () => console.info(`Server running on port: ${port}`));
