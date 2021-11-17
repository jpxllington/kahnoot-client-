const server = require("http").createServer();
const Game = require("./model")

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        method: ["GET","POST"],
        credentials:true
    }
});

const game = new Game();

io.on("connection", socket => {
    console.log("connected");

    let socketID = socket.id
    socket.on("create", (roomName, username,cb) =>{
        game.addGame(username, roomName);
        // socket.join(username);
        // game.addPlayer(username,roomName);
        cb({
            message: "game successfully created"
        })
    })
       
    socket.on("joinRoom", (username, roomName,cb) => {
        game.addPlayer(username, roomName, socketID);
        socket.join(roomName);
        // socket.emit(`${username} has joined`)
        try{
            let currentGame = game.getRoom(roomName);
            console.log(currentGame);
            cb({
                players: currentGame.players,
                host: currentGame.host
            })

            socket.broadcast.emit("updatedPlayers", currentGame.players)

        } catch(e){
            console.warn(e);
        }
         })

    socket.on("disconnect",()=>{  
        
        let {updatedPlayers,roomName} = game.deletePlayer(socketID)
        console.log(updatedPlayers, );
        if(!updatedPlayers.length){
            game.deleteRoom(roomName)
        }
        socket.broadcast.emit("updatedPlayers", updatedPlayers)
    })

    socket.on("add-config", (config) => {
        game.addGame(config.host, config.room, config.amount, config.subject, config.difficulty)
        socket.join(config.host)
    })

    socket.on('game-players', (roomID) => {
        const gamePlayers = games.getPlayers(roomID)
        io.in(roomID).emit(gamePlayers);
    })
    
    // io.to(roomName).emit('game-players');

    socket.on("game-start", (roomID) =>{
        io.to(roomID).emit("game-start", true)
    })

    socket.on('scores', (config, cb) => {
        let scores = game.addScore(config.room, config.username, config.score)
        io.to(config.room).emit('score',scores)

        cb({
            code: "success",
            scores:scores
        })
    })

    socket.on("check-room", (roomName,cb)=>{
        let room = game.checkRoom(roomName)
        console.log(room); 
        console.log(game);
        cb({
            roomExists:room
        })
        // if(room){

        // }
    })
    
    socket.on("sendData", (roomName, apiData, cb) => {
        let updatedGame =game.addData(roomName,apiData)
        console.log(updatedGame);
    })

    socket.on("gameData", (roomName, cb) =>{
        let gamedata = game.getRoom(roomName)
        // console.log(gamedata.apiData);
        cb({
            apiData: gamedata.apiData
        })
    })

    socket.on("game-start-request", (roomName, cb) =>{
        console.log("youre getting here");
        socket.broadcast.emit("game-start")
        socket.emit("game-start")
    })
})



module.exports = server;