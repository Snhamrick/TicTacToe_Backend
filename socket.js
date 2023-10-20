const http = require('http');
const socketio = require('socket.io');
const app = require('./app');
const userController = require('./API/Controllers/userController');

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let lobby = [];
let gameNumber = 0;

io.on("connection", (socket) => {
  console.log("User has connected");

  socket.emit("connected", "User has connected");


  //Join game room and generate game to be played when lobby is greater than 2

  socket.on("join game", (user)=> {

    //create object for waiting lobby
    let userWaiting = {
      username: user,
      id: socket.id
    }
    //add object to lobby
    lobby.push(userWaiting);

    //have socket join game room
    socket.join("game" + gameNumber);

    //if lobby length is less than 2 set timeout for none found
    if (lobby.length === 1) {
      setTimeout(() => {
        socket.emit("none found", "No players found at this time");
        socket.leave("game" + gameNumber);
        lobby.splice(0, 1);
      }, 25000);
      //if lobby length is greater than 2
    }  else if (lobby.length >= 2) {
      //dont allow players to play themselves
      if (lobby[0].username === lobby[1].username) {
        socket.leave("game" + gameNumber);
        lobby.splice(0, 2);
        socket.emit("none found", "You may not play against yourself");
        //if not the same player set up game
      } else {
      //create player1 object
      let player1 = {
        username: lobby[0].username,
        move: 'X',
        action: -1
      }
      //create player2 object
      let player2 = {
        username: lobby[1].username,
        move: 'O',
        action: -1
      }

      //create game object
      let game = {
        player1: player1,
        player2: player2,
        activePlayer: player1.username,
        winner: false,
        gameName: "game" + gameNumber
      }

      //remove players from lobby
      lobby.splice(0, 2);

      io.to("game" + gameNumber).emit("found game", game);
      gameNumber++
    }
  }
});

  //send game back on start
  socket.on("start", (game) => {
      io.to(game.gameName).emit("start", game);
    });

  //create the move from the game to be sent back
  socket.on("new move", (game) => {
    if (game.activePlayer === game.player1.username) {
      let move = {
        indicator: 'X',
        index: game.player1.action,
        nextPlayer: game.player2.username
      }
      io.to(game.gameName).emit("move made", move);
    } else {
      let move = {
        indicator: 'O',
        index: game.player2.action,
        nextPlayer: game.player1.username
      }
      io.to(game.gameName).emit("move made", move);
    }
  });

  //respond when someone has won the game
  socket.on("winner", (game) => {
    console.log(game);
    io.to(game.gameName).emit("winner", game.activePlayer);
  });

  //respond when game is a draw
  socket.on("draw", (game) => {
    console.log("game was a draw");
    io.to(game.gameName).emit("draw");
  })

  //handle socket leaving game
  socket.on("leave game", (game) => {
    socket.leave(game.gameName);
    io.to(game.gameName).emit("left", game);
  });

  socket.on("new chat", (chat) => {
    io.to(chat.gameName).emit("new chat", chat);
  })


});








  io.engine.on("connection_error", (err) => {
    console.log(err.req);      // the request object
    console.log(err.code);     // the error code, for example 1
    console.log(err.message);  // the error message, for example "Session ID unknown"
    console.log(err.context);  // some additional error context
  });

  module.exports = server;