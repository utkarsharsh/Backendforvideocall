import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from 'dotenv'
import express from 'express'
// import path from "path";
dotenv.config()
const app=express();



 const httpServer = createServer();


const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});
let socketmap=new Map();
let mapsocket=new Map();

io.on("connection", (socket) => {
 console.log(socket.id);
 socket.on("chat",({email,room})=>{
    console.log(email,room,socket.id);
    io.to(room).emit("room:join",socket.id);
    socket.join(room);
  
 });
socket.on("usercallingto",({to,offer})=>{
  io.to(to).emit("callutha",{from:socket.id,offer});
})
socket.on("answerofcall",({to,ans})=>{
  console.log("answer",ans);
  io.to(to).emit("accepted",{from :socket.id,ans});
  
})
socket.on("nego:need",({to,offer})=>{
  io.to(to).emit("nego:needed",{from :socket.id,offer});
})
socket.on("nego:last",({to,ans})=>{
  io.to(to).emit("nego:lasted",{from :socket.id,ans});
});
socket.on("message",({naam,data})=>{
    io.emit("messaging", {naam,data});
});
socket.on("makereact",({index})=>{
    console.log(index);
    io.emit("reactresponse", {index});
})
});

httpServer.listen(3000 || process.env.Port);