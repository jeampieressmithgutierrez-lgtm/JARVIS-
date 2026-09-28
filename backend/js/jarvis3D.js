"use strict";

console.log("=================================");
console.log("JARVIS 3D — ARCHIVO CARGADO");
console.log("=================================");

document.body.style.border = "15px solid red";

const canvas = document.getElementById("jarvis-3d-canvas");

console.log("Canvas encontrado:", canvas);

if (canvas) {
    canvas.style.background = "red";
    canvas.style.opacity = "1";
}
