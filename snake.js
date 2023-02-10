const lienzo = document.getElementById("sCanvas");
let contexto = lienzo.getContext("2d");
let direccion;
let manzana = {x: 0, y: 0};
let puntuacion;
let intervaloDeJuego;

//* Snake

let snake;

function dibujarSnake(){        //* Dibujar serpiente
    for(let cuerpoSnake of snake){
        contexto.beginPath();
        contexto.fillStyle = "#2e490b";
        contexto.fillRect(cuerpoSnake.x, cuerpoSnake.y, 10, 10);
        contexto.stroke();
    }
}

//* Controles

document.addEventListener("keyup", (e)=>{   //* Mover serpiente
    if (e.code == "ArrowUp" && direccion !== "abajo"){    //* Modificar dirección y no permitir direc. contraria
        direccion = "arriba";
    }
    else if (e.code == "ArrowDown" && direccion !== "arriba"){
        direccion = "abajo";
    }
    else if (e.code == "ArrowRight" && direccion !== "izquierda"){
        direccion = "derecha";
    }
    else if (e.code == "ArrowLeft" && direccion !== "derecha"){
        direccion = "izquierda";
    }
});

function modCoordenadas(){          //* Modificación de coordenadas
    let nuevaCoordenada;
    
    if (direccion == "arriba"){
        nuevaCoordenada = [0, -10];
        return nuevaCoordenada;
    }
    else if (direccion == "abajo"){
        nuevaCoordenada = [0, 10];
        return nuevaCoordenada;
    }
    else if (direccion == "derecha"){
        nuevaCoordenada = [10, 0];
        return nuevaCoordenada;
    }
    else if (direccion == "izquierda"){
        nuevaCoordenada = [-10, 0];
        return nuevaCoordenada;
    }
}

function modCoordenadasCabeza(){        //* Eliminación de cola para efecto de movimiento y nuevas cooordenas de cabeza
    let cabeza = snake[0];
    let siguienteCabeza = {x: 0 , y: 0};
    
    siguienteCabeza.x = cabeza.x + modCoordenadas()[0];
    siguienteCabeza.y = cabeza.y + modCoordenadas()[1];
    
    snake.unshift(siguienteCabeza);

    if (colisiones() != true){
        snake.pop();
    }
}

//* Comida

function dibujarComida(){
    contexto.fillStyle = "red";
    contexto.fillRect(manzana.x, manzana.y, 10, 10);
}

function modPosicionComida() { //* Nueva posicicion de comida e incremento de puntuación
    let segmentosSnake = new Set();
    snake.forEach(parteDeSnake => segmentosSnake.add(`${parteDeSnake.x}${parteDeSnake.y}`));

    manzana.x = Math.floor(Math.random()*300/10)*10;
    manzana.y = Math.floor(Math.random()*300/10)*10;
    puntuacion += 10;
    
    if (segmentosSnake.has(`${manzana.x}${manzana.y}`)){ //* Comprobar que la comida no este sobre la serpiente
        return modPosicionComida();
    }
}

// *Colisiones

 function colisiones(){
    
    let cabeza = snake[0];
    
    let segmentosSnake = new Set();
    snake.forEach(parteDeSnake => segmentosSnake.add(`${parteDeSnake.x}${parteDeSnake.y}`));

    if(cabeza.x == manzana.x && cabeza.y == manzana.y){     //*Comer manzana
        modPosicionComida();
        return true;
    }

    if (cabeza.x > 290 || cabeza.x < 0 || cabeza.y > 290 || cabeza.y < 0){   //*Chocar con bordes
        gameOver();
    }

    if (snake.length !== segmentosSnake.size){  //*Chocar con cuerpo
        gameOver();
    }
}

//*Limpiar canvas

function limpiar(){
    contexto.clearRect(0, 0, 300, 300);
}

//*Final de juego

function gameOver(){
    clearInterval(intervaloDeJuego);
    intervaloDeJuego = undefined;
    contexto.font = "20px Arial";
    contexto.fillStyle = "#2e490b";
    contexto.fillText(`¡Game Over! Tu puntuación: ${puntuacion}`, 10, 25);
    daClic(1);
}

//*Loop del juego

function loopJuego(){
    limpiar();
    modCoordenadasCabeza();
    dibujarSnake();
    dibujarComida();
    colisiones();
}
//* Nuevo juego

function nuevoJuego(){
    
    direccion = "abajo";

    snake = [           //* Segmentos de la serpiente
        {x: 50, y: 30},
        {x: 50, y: 20},
        {x: 50, y: 10},
        {x: 50, y: 0}
    ];
    
    puntuacion = 0;
    modPosicionComida();
    intervaloDeJuego = setInterval(loopJuego, 1000 / 15);
}

document.addEventListener("click", () => { //* Esperar clic para comenzar
    if (intervaloDeJuego == undefined){
        nuevoJuego();
    } 
});

//* Presiona

function daClic(x){
    
    let y = "iniciar";
    let z = 35;

    if (x == 1){
        y = "reiniciar";
        z = 20;
    }
    contexto.font = "20px Arial";
    contexto.fillStyle = "#2e490b";
    contexto.fillText(`Da clic para ${y} el juego`, z, 150);
}

daClic(0);