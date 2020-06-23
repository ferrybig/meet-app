System.register("common/utils/ActionCreator", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function action(type, func) {
        function actionCreator() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return {
                payload: func.apply(void 0, args),
                type: type
            };
        }
        actionCreator.type = type;
        var stringified = func.toString();
        var splitPoint = Math.min.apply(Math, [stringified.indexOf('=>'), stringified.indexOf('{')].filter(function (e) { return e >= 0; }));
        var nameAndArguments = stringified.substring(0, splitPoint);
        var paraphesesOpen = nameAndArguments.indexOf('(') >= 0 ? nameAndArguments.indexOf('(') + 1 : 0;
        var paraphesesClose = nameAndArguments.indexOf(')') >= 0 ? nameAndArguments.indexOf(')') : nameAndArguments.length;
        actionCreator.toString = function () { return type + "(" + nameAndArguments.substring(paraphesesOpen, paraphesesClose).trim() + ")"; };
        return actionCreator;
    }
    exports_1("default", action);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("server/store/actions", ["common/utils/ActionCreator"], function (exports_2, context_2) {
    "use strict";
    var ActionCreator_1, newConnection, clientJoin, clientOutgoingSdp, clientOutgoingIce, clientDisconnect, clientPing;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (ActionCreator_1_1) {
                ActionCreator_1 = ActionCreator_1_1;
            }
        ],
        execute: function () {
            exports_2("newConnection", newConnection = ActionCreator_1["default"]('newConnection', function (webSocket, roomId) { return ({ webSocket: webSocket, roomId: roomId }); }));
            exports_2("clientJoin", clientJoin = ActionCreator_1["default"]('clientJoin', function (roomId, clientId, name) { return ({ roomId: roomId, clientId: clientId, name: name }); }));
            exports_2("clientOutgoingSdp", clientOutgoingSdp = ActionCreator_1["default"]('clientOutgoingSdp', function (sourceClientId, clientId, sdp, isOffer) { return ({ sourceClientId: sourceClientId, clientId: clientId, sdp: sdp, isOffer: isOffer }); }));
            exports_2("clientOutgoingIce", clientOutgoingIce = ActionCreator_1["default"]('clientOutgoingIce', function (sourceClientId, clientId, ice) { return ({ sourceClientId: sourceClientId, clientId: clientId, ice: ice }); }));
            exports_2("clientDisconnect", clientDisconnect = ActionCreator_1["default"]('clientDisconnect', function (roomId, clientId) { return ({ roomId: roomId, clientId: clientId }); }));
            exports_2("clientPing", clientPing = ActionCreator_1["default"]('clientPing', function (clientId) { return ({ clientId: clientId }); }));
        }
    };
});
System.register("server/index", ["http", "express", "ws", "./store", "server/store/actions"], function (exports_3, context_3) {
    "use strict";
    var http_1, express_1, ws_1, store_1, actions_1, app, port, server, webSocketServer;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (express_1_1) {
                express_1 = express_1_1;
            },
            function (ws_1_1) {
                ws_1 = ws_1_1;
            },
            function (store_1_1) {
                store_1 = store_1_1;
            },
            function (actions_1_1) {
                actions_1 = actions_1_1;
            }
        ],
        execute: function () {
            app = express_1["default"]();
            port = process.env.PORT || 5000;
            server = http_1.createServer(app);
            server.listen(port, function () { return console.info("Server running on port: " + port); });
            webSocketServer = new ws_1["default"].Server({ server: server });
            webSocketServer.on("connection", function (webSocket) {
                store_1["default"].dispatch(actions_1.newConnection(webSocket, webSocket.url));
            });
        }
    };
});
