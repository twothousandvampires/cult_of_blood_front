import socket from "/socket.js";

let socket_id
let role
socket.on("connect", () => {
    socket_id = socket.id
});

socket.on("delete_player", (socket_id) => {
    data.sprites = data.sprites.filter(elem => elem.socket_id != socket_id)
});

socket.on('get_role', (r) => {
    role = r
    if(role === 'player'){
        let div = document.getElementById('nick_input')
        div.style.display = 'flex'
        div.addEventListener('keypress', function (e){
            if (e.key === 'Enter') {
               socket.emit('init', document.getElementById('nick').value,  document.getElementById('skin').value)
               div.style.display = 'none'
            }
        })
    }
})

socket.on('modal', (data) => {
    let tick = 0
    let p = document.getElementsByTagName('body')[0]
    let modal = document.createElement('p')
    modal.style.color = data.color
    modal.style.top = 400 - 50 + 'px'
    modal.style.left = 600 - 50 + 'px'
    modal.innerText = data.value
    modal.className  = 'modal'
    p.appendChild(modal)
    let modal_interval = setInterval(() => {
        if(tick == 10){
            p.removeChild(modal)
            clearInterval(modal_interval)
        }
        tick ++
        modal.style.top = parseInt(modal.style.top) - 10 + 'px'
    },200)
})
let arrows = []
socket.on('updateArrows', (data) => {
    arrows = data
})

socket.on("updatePlayers", (server_data) => {
    data.backEndPlayers = server_data
    for(let item in server_data){

        const backEndPlayer = server_data[item]

        if(backEndPlayer.socket_id === socket_id && role !== 'spec'){
            data.player.angle = backEndPlayer.angle
            data.player.x += (backEndPlayer.x - data.player.x) * 0.5
            data.player.y += (backEndPlayer.y - data.player.y) * 0.5
            data.player.hp = backEndPlayer.hp
            data.player.state = backEndPlayer.state
        }

        else {
            let exist = data.sprites.find(elem => elem.socket_id === server_data[item].socket_id )
            if(exist){
                exist.x += (backEndPlayer.x - exist.x) * 0.5
                exist.y += (backEndPlayer.y - exist.y) * 0.5
                exist.angle = server_data[item].angle
                exist.hp = backEndPlayer.hp
                exist.previos_state = exist.state
                exist.state = backEndPlayer.state
            }
            else {
                data.sprites.push({
                    x: server_data[item].x,
                    y: server_data[item].y,
                    angle: server_data[item].angle,
                    socket_id: server_data[item].socket_id,
                    nick: server_data[item].nick,
                    hp: server_data[item].hp,
                    id: server_data[item].skin,
                    state: server_data[item].state,
                    frame: 0,
                    frame_timer: 0,
                })
            }
        }
    }
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}
const SPEED = 0.04

setInterval(() => {
    let d = {
        dx: 0,
        dy: 0,
        da: 0
    }
    if (keys.w.pressed) {
        let dx = Math.cos(degreeToRadians(data.player.angle)) * SPEED
        let dy = Math.sin(degreeToRadians(data.player.angle)) * SPEED
        // data.player.x += Math.cos(degreeToRadians(data.player.angle)) * SPEED
        // data.player.y += Math.sin(degreeToRadians(data.player.angle)) * SPEED
        d.dx += dx
        d.dy += dy
        // socket.emit('keydown', 'KeyW')
    }

    if (keys.s.pressed) {
        let dx = Math.cos(degreeToRadians(data.player.angle)) * SPEED
        let dy = Math.sin(degreeToRadians(data.player.angle)) * SPEED
        // data.player.x -= Math.sin(degreeToRadians(data.player.angle)) * SPEED
        // data.player.y -= Math.cos(degreeToRadians(data.player.angle)) * SPEED
        d.dx -= dx
        d.dy -= dy
        // socket.emit('keydown', 'KeyS')
    }

    if (keys.a.pressed) {
        let da = -3
        // data.player.angle -= 3
        // socket.emit('keydown', 'KeyA')
        d.da += da
    }
    if (keys.d.pressed) {
        let da = + 3
        d.da += da
    }

    let check_x = Math.floor(data.player.x + d.dx + (d.dx < 0 ? -0.3 : 0.3))
    let check_y = Math.floor(data.player.y + d.dy + (d.dy < 0 ? -0.3 : 0.3))

    if(data.map[check_y][Math.floor(data.player.x)] != 0){
        d.dy = 0
    }
    if(data.map[Math.floor(data.player.y)][check_x] != 0){
        d.dx = 0
    }

    if(role === 'player'){
        socket.emit('inputs', d)
    }
    else {
        data.player.x += d.dx
        data.player.y += d.dy
        data.player.angle += d.da
        if( data.player.angle > 360)  data.player.angle -= 360
        if( data.player.angle < 0)  data.player.angle += 360
    }
}, 30)

window.addEventListener('keydown', (event) => {

    switch (event.code) {
        case 'KeyW':
            keys.w.pressed = true
            break

        case 'KeyA':
            keys.a.pressed = true
            break

        case 'KeyS':
            keys.s.pressed = true
            break
        case 'KeyD':
            keys.d.pressed = true
            break
        case 'KeyE':
            socket.emit('arrow_shot')
            break
    }
})

window.addEventListener('keyup', (event) => {

    switch (event.code) {
        case 'KeyW':
            keys.w.pressed = false
            break

        case 'KeyA':
            keys.a.pressed = false
            break

        case 'KeyS':
            keys.s.pressed = false
            break

        case 'KeyD':
            keys.d.pressed = false
            break
    }

})

window.addEventListener('mousedown', (event) =>{
    if(data.player.attack) return
    data.player.attack = true
    setTimeout(()=>{
        for(let i = 0; i < data.sprites.length; i++) {
            let p =  data.sprites[i]
            if(p.socket_id === socket_id) continue
            if(!p.in_attack) continue
            let distance = Math.sqrt(Math.pow(p.x - data.player.x, 2) + Math.pow(p.y - data.player.y, 2))
            if(distance > 0.8) continue
            socket.emit('hit_player', p.socket_id)
        }
        data.player.attack = false
    }, 1500)
})

var hud = new Image()
hud.src = 'hud.png'
let data = {
    screen: {
        width: 1200,
        height: 800,
        halfWidth: null,
        halfHeight: null,
        scale: 4
    },
    projection: {
        width: null,
        height: null,
        halfWidth: null,
        halfHeight: null,
        imageData: null,
        buffer: null
    },
    render: {
        delay: 30
    },
    rayCasting: {
        incrementAngle: null,
        precision: 64
    },
    player: {
        fov: 60,
        halfFov: null,
        x: 2,
        y: 2,
        angle: 0,
        radius: 20,
        speed: {
            movement: 0.01,
            rotation: 0.7
        }
    },
    map: [
        [2,2,2,2,2,2,2,2,2,2,2,2],
        [2,0,0,0,0,0,0,0,0,0,0,2],
        [2,0,0,0,0,0,0,0,0,0,0,2],
        [2,0,0,0,0,0,2,0,0,0,0,2],
        [2,0,0,0,0,0,2,0,0,0,0,2],
        [2,0,0,0,0,0,2,0,0,0,0,2],
        [2,0,0,0,0,2,2,0,0,0,0,2],
        [2,0,0,0,0,0,0,0,0,0,0,2],
        [2,0,0,0,0,0,0,0,0,0,0,2],
        [2,0,0,0,0,0,0,0,0,0,0,2],
        [2,0,0,0,0,0,0,0,0,0,0,2],
        [2,2,2,2,2,2,2,2,2,2,2,2],
    ],
    key: {
        up: {
            code: "KeyW",
            active: false
        },
        down: {
            code: "KeyS",
            active: false
        },
        left: {
            code: "KeyA",
            active: false
        },
        right: {
            code: "KeyD",
            active: false
        }
    },
    textures: [
        {
            width: 8,
            height: 8,
            bitmap: [
                [1,1,1,1,1,1,1,1],
                [0,0,0,1,0,0,0,1],
                [1,1,1,1,1,1,1,1],
                [0,1,0,0,0,1,0,0],
                [1,1,1,1,1,1,1,1],
                [0,0,0,1,0,0,0,1],
                [1,1,1,1,1,1,1,1],
                [0,1,0,0,0,1,0,0]
            ],
            colors: [
                "rgb(255, 241, 232)",
                "rgb(194, 195, 199)",
            ]
        },
        {
            width: 16,
            height: 16,
            id: "texture",
            data: null
        }
    ],
    floorTextures: [
        {
            width: 16,
            height: 16,
            id: "floor-texture",
            data: null
        }
    ],
    backgrounds: [
        {
            width: 720,
            height: 120,
            id: "background",
            data: null
        }
    ],
    sprites_texture_data: [
        {
            id: 'skeleton',
            state_sprite_data: [
              {
                 src: './sprites/skeleton/skeleton_idle.png',
                 width: 220,
                 height: 300,
              },
              {
                 src: './sprites/skeleton/skeleton_walk.png',
                  width: 220,
                  height: 300,
              }
            ],
        },
        {
            id: 'titan',
            state_sprite_data: [
                {
                    src: './sprites/titan/titan_idle.png',
                    width: 205,
                    height: 375,
                },
                {
                    src: './sprites/titan/titan_walk.png',
                    width: 205,
                    height: 375,
                }
            ],
        },
        // {
        //     id: 'bat',
        //     width: 150,
        //     height: 226,
        //     data: null,
        //     src: 'bat.png'
        // }
    ],
    sprites: [

    ]
}

// Calculated data
data.screen.halfWidth = data.screen.width / 2;
data.screen.halfHeight = data.screen.height / 2;
data.player.halfFov = data.player.fov / 2;
data.projection.width = data.screen.width / data.screen.scale;
data.projection.height = data.screen.height / data.screen.scale;
data.projection.middle = data.projection.width / 2
data.projection.halfWidth = data.projection.width / 2;
data.projection.halfHeight = data.projection.height / 2;
data.rayCasting.incrementAngle = data.player.fov / data.projection.width;

// Canvas
const screen = document.createElement('canvas');
screen.width = data.screen.width;
screen.height = data.screen.height;
screen.style.border = "1px solid black";
document.body.appendChild(screen);

// Canvas context
const screenContext = screen.getContext("2d");
screenContext.scale(data.screen.scale, data.screen.scale);
screenContext.imageSmoothingEnabled = false;

// Buffer
data.projection.imageData = screenContext.createImageData(data.projection.width, data.projection.height);
data.projection.buffer = data.projection.imageData.data;

// Main loop
let mainLoop = null;

/**
 * Cast degree to radian
 * @param {Number} degree 
 */
function degreeToRadians(degree) {
    let pi = Math.PI;
    return degree * pi / 180;
}

/**
 * Color object
 * @param {number} r 
 * @param {number} g 
 * @param {number} b 
 * @param {number} a 
 */
function Color(r, g, b, a) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
}

/**
 * Draw pixel on buffer
 * @param {number} x 
 * @param {number} y 
 * @param {RGBA Object} color 
 */
let x = 0
function drawPixel(x, y, color, distance) {
    if(!color.a) return;
    let shadow = 0;
    if (distance){
        shadow = 15 * distance
    }
    let r = color.r - shadow
    if(r < 0) r = 0
    let g = color.g - shadow
    if(g < 0) g = 0
    let b = color.b - shadow
    if(b < 0) b = 0
    let offset = 4 * (Math.floor(x) + Math.floor(y) * data.projection.width);
    data.projection.buffer[offset  ] = r;
    data.projection.buffer[offset+1] = g;
    data.projection.buffer[offset+2] = b;
    data.projection.buffer[offset+3] = color.a;
}

/**
 * Draw line in the buffer
 * @param {Number} x 
 * @param {Number} y1 
 * @param {Number} y2 
 * @param {Color} color 
 */
function drawLine(x1, y1, y2, color, distance) {
    for(let y = y1; y < y2; y++) {
        drawPixel(x1, y, color, distance);
    }
}

/**
 * Floorcasting
 * @param {*} x1 
 * @param {*} wallHeight 
 * @param {*} rayAngle 
 */
function drawFloor(x1, wallHeight, rayAngle) {
    let start = data.projection.halfHeight + wallHeight + 1;
    let directionCos = Math.cos(degreeToRadians(rayAngle))
    let directionSin = Math.sin(degreeToRadians(rayAngle))
    let playerAngle = data.player.angle
    for(let y = start; y < data.projection.height; y++) {
        // Create distance and calculate it
        let distance = data.projection.height / (2 * y - data.projection.height)
        // distance = distance * Math.cos(degreeToRadians(playerAngle) - degreeToRadians(rayAngle))

        // Get the tile position
        let tilex = distance * directionCos
        let tiley = distance * directionSin
        tilex += data.player.x
        tiley += data.player.y
        let tile = data.map[Math.floor(tiley)][Math.floor(tilex)]
        
        // Get texture
        let texture = data.floorTextures[tile]

        if(!texture) {
            continue
        }

        // Define texture coords
        let texture_x = (Math.floor(tilex * texture.width)) % texture.width
        let texture_y = (Math.floor(tiley * texture.height)) % texture.height
        
        // Get pixel color
        let color = texture.data[texture_x + texture_y * texture.width];
        drawPixel(x1, y, color, distance)
    }
}

// Start
window.onload = function() {
    loadTextures();
    loadBackgrounds();
    loadSprites();
    main();
}

/**
 * Main loop
 */
function main() {
    mainLoop = setInterval(function() {
        inativeSprites();
        clearScreen();
        // movePlayer();
        rayCasting();
        renderBuffer();
        drawSprites();
        arrows.forEach(elem => {

            let spriteXRelative = elem.x - data.player.x;
            let spriteYRelative = elem.y - data.player.y;

            // Get angle of the sprite in relation of the player angle
            let spriteAngleRadians = Math.atan2(spriteYRelative, spriteXRelative);
            let spriteAngle = radiansToDegrees(spriteAngleRadians) - Math.floor(data.player.angle - data.player.halfFov);

            let spriteX = Math.floor(spriteAngle * data.projection.width / data.player.fov);

            let distance = Math.sqrt(Math.pow(data.player.x - elem.x, 2) + Math.pow(data.player.y - elem.y, 2));

            let Width = Math.floor(40 / distance);
            let Height = Math.floor(40 / distance);

            screenContext.beginPath();
            screenContext.arc(spriteX, data.projection.halfHeight, Width, 0, 2 * Math.PI);
            screenContext.stroke();
            screenContext.fill();

        })
        screenContext.drawImage(hud,
            0,0,
            300,200
        ,0,0,
        data.projection.width,
    data.projection.height)
    }, data.render.dalay);
}

/**
 * Render buffer
 */
function renderBuffer() {
    let canvas = document.createElement('canvas');
    canvas.width = data.projection.width;
    canvas.height = data.projection.height;
    canvas.getContext('2d').putImageData(data.projection.imageData, 0, 0);
    screenContext.drawImage(canvas, 0, 0);
}

/**
 * Raycasting logic
 */
let buffer = []
function rayCasting() {
    buffer = []
    let rayAngle = data.player.angle - data.player.halfFov;
    for(let rayCount = 0; rayCount < data.projection.width; rayCount++) {
        
        // Ray data
        let ray = {
            x: data.player.x,
            y: data.player.y
        }

        // Ray path incrementers
        let rayCos = Math.cos(degreeToRadians(rayAngle)) / data.rayCasting.precision;
        let raySin = Math.sin(degreeToRadians(rayAngle)) / data.rayCasting.precision;
        
        // Wall finder
        let wall = 0;
        while(wall == 0) {
            ray.x += rayCos;
            ray.y += raySin;
            wall = data.map[Math.floor(ray.y)][Math.floor(ray.x)];
            activeSprites(ray.x, ray.y);
        }

        // Pythagoras theorem
        let distance = Math.sqrt(Math.pow(data.player.x - ray.x, 2) + Math.pow(data.player.y - ray.y, 2));

        // Fish eye fix
        distance = distance * Math.cos(degreeToRadians(rayAngle - data.player.angle));

        // Wall height
        let wallHeight = Math.floor(data.projection.halfHeight / distance);

        // Get texture
        let texture = data.textures[wall - 1];

        // Calcule texture position
        let texturePositionX = Math.floor((texture.width * (ray.x + ray.y)) % texture.width);

        // Draw
        drawBackground(rayCount, 0, data.projection.halfHeight - wallHeight, data.backgrounds[0]);
        drawTexture(rayCount, wallHeight, texturePositionX, texture, distance);
        drawFloor(rayCount, wallHeight, rayAngle)
        buffer.push(distance)
        // Increment
        rayAngle += data.rayCasting.incrementAngle;
    }
}

/**
 * Clear screen
 */
function clearScreen() {
    screenContext.clearRect(0, 0, data.projection.width, data.projection.height);
}

/**
 * Movement
 */
function movePlayer() {
    if(data.key.up.active) {
        let playerCos = Math.cos(degreeToRadians(data.player.angle)) * data.player.speed.movement;
        let playerSin = Math.sin(degreeToRadians(data.player.angle)) * data.player.speed.movement;
        let newX = data.player.x + playerCos;
        let newY = data.player.y + playerSin;
        let checkX = Math.floor(newX + playerCos * data.player.radius);
        let checkY = Math.floor(newY + playerSin * data.player.radius);

        // Collision detection
        if(data.map[checkY][Math.floor(data.player.x)] == 0) {
            data.player.y = newY;
        }
        if(data.map[Math.floor(data.player.y)][checkX] == 0) {
            data.player.x = newX;
        } 

    }
    if(data.key.down.active) {
        let playerCos = Math.cos(degreeToRadians(data.player.angle)) * data.player.speed.movement;
        let playerSin = Math.sin(degreeToRadians(data.player.angle)) * data.player.speed.movement;
        let newX = data.player.x - playerCos;
        let newY = data.player.y - playerSin;
        let checkX = Math.floor(newX - playerCos * data.player.radius);
        let checkY = Math.floor(newY - playerSin * data.player.radius);

        // Collision detection
        if(data.map[checkY][Math.floor(data.player.x)] == 0) {
            data.player.y = newY;
        }
        if(data.map[Math.floor(data.player.y)][checkX] == 0) {
            data.player.x = newX;
        } 
    }
    if(data.key.left.active) {
        socket.emit('keyDown', )
        data.player.angle -= data.player.speed.rotation;
        if(data.player.angle < 0) data.player.angle += 360;
        data.player.angle %= 360;
    }
    if(data.key.right.active) {
        data.player.angle += data.player.speed.rotation;
        if(data.player.angle < 0) data.player.angle += 360;
        data.player.angle %= 360;
    } 
}

/**
 * Key down check
 */
// document.addEventListener('keydown', (event) => {
//     let keyCode = event.code;
//     // socket.emit('keyDown', keyCode)
//     if(keyCode === data.key.up.code) {
//         data.key.up.active = true;
//     }
//     if(keyCode === data.key.down.code) {
//         data.key.down.active = true;
//     }
//     if(keyCode === data.key.left.code) {
//         data.key.left.active = true;
//     }
//     if(keyCode === data.key.right.code) {
//         data.key.right.active = true;
//     }
// });

/**
 * Key up check
 */
// document.addEventListener('keyup', (event) => {
//     let keyCode = event.code;
//
//     if(keyCode === data.key.up.code) {
//         data.key.up.active = false;
//     }
//     if(keyCode === data.key.down.code) {
//         data.key.down.active = false;
//     }
//     if(keyCode === data.key.left.code) {
//         data.key.left.active = false;
//     }
//     if(keyCode === data.key.right.code) {
//         data.key.right.active = false;
//     }
// });

/**
 * Draw texture
 * @param {*} x 
 * @param {*} wallHeight 
 * @param {*} texturePositionX 
 * @param {*} texture 
 */
function drawTexture(x, wallHeight, texturePositionX, texture, distance) {
    let yIncrementer = (wallHeight * 2) / texture.height;
    let y = data.projection.halfHeight - wallHeight;
    let color = null
    for(let i = 0; i < texture.height; i++) {
        if(texture.id) {            
            color = texture.data[texturePositionX + i * texture.width];
        } else {
            color = texture.colors[texture.bitmap[i][texturePositionX]];
        }
        drawLine(x, y, Math.floor(y + yIncrementer + 2), color, distance);
        y += yIncrementer;
    }
}

/**
 * Load textures
 */
function loadTextures() {
    for(let i = 0; i < data.textures.length; i++) {
        if(data.textures[i].id) {
            data.textures[i].data = getTextureData(data.textures[i]);
        }
    }
    for(let i = 0; i < data.floorTextures.length; i++) {
        if(data.floorTextures[i].id) {
            data.floorTextures[i].data = getTextureData(data.floorTextures[i]);
        }
    }
}

/**
 * Load backgrounds
 */
function loadBackgrounds() {
    for(let i = 0; i < data.backgrounds.length; i++) {
        if(data.backgrounds[i].id) {
            data.backgrounds[i].data = getTextureData(data.backgrounds[i]);
        }
    }
}

/**
 * Load sprites
 */
function loadSprites() {
    for(let i = 0; i < data.sprites_texture_data.length; i++) {
        if(data.sprites_texture_data[i].id) {
            console.log(data.sprites_texture_data[i].state_sprite_data)
            for(let j = 0 ; j < data.sprites_texture_data[i].state_sprite_data.length; j ++){
                data.sprites_texture_data[i].state_sprite_data[j].img = new Image()
                data.sprites_texture_data[i].state_sprite_data[j].img.src = data.sprites_texture_data[i].state_sprite_data[j].src
            }
            // data.sprites_texture_data[i].img = new Image()
            // data.sprites_texture_data[i].img.src = data.sprites_texture_data[i].src
        }
    }
}

/**
 * Get texture data
 * @param {Object} texture 
 */
function getTextureData(texture) {
    let image = document.getElementById(texture.id);
    let canvas = document.createElement('canvas');
    canvas.width = texture.width;
    canvas.height = texture.height;
    let canvasContext = canvas.getContext('2d');
    canvasContext.clearRect(0,0, texture.width, texture.height)
    canvasContext.drawImage(image, 0, 0, texture.width, texture.height);
    let imageData = canvasContext.getImageData(0, 0, texture.width, texture.height).data;
    return parseImageData(imageData);
}

/**
 * Parse image data to a Color array
 * @param {array} imageData 
 */
function parseImageData(imageData) {
    let colorArray = [];
    for (let i = 0; i < imageData.length; i += 4) {
        colorArray.push(new Color(imageData[i], imageData[i + 1], imageData[i + 2],  imageData[i + 3]));
    }
    return colorArray;
}

/**
 * Window focus
 */
screen.onclick = function() {
    if(!mainLoop) {
        main();
    }
}

/**
 * Window focus lost event
 */
// window.addEventListener('blur', function(event) {
//     clearInterval(mainLoop);
//     mainLoop = null;
//     renderFocusLost();
// });

/**
 * Render focus lost
 */
function renderFocusLost() {
    screenContext.fillStyle = 'rgba(0,0,0,0.5)';
    screenContext.fillRect(0, 0, data.projection.width, data.projection.height);
    screenContext.fillStyle = 'white';
    screenContext.font = '10px Lucida Console';
    screenContext.fillText('CLICK TO FOCUS',data.projection.halfWidth/2,data.projection.halfHeight);
}

/**
 * Draw the background
 * @param {number} x 
 * @param {number} y1 
 * @param {number} y2 
 * @param {Object} background 
 */
function drawBackground(x, y1, y2, background) {
    let offset = (data.player.angle + x);
    for(let y = y1; y < y2; y++) {
        let textureX = Math.floor(offset % background.width);
        let textureY = Math.floor(y % background.height);
        let color = background.data[textureX + textureY * background.width];
        drawPixel(x, y, color); 
    }
}

/**
 * Convert radians to degrees
 * @param {number} radians 
 */
function radiansToDegrees(radians) {
     return 180 * radians / Math.PI;
}

/**
 * Active sprites in determinate postion
 * @param {number} x 
 * @param {number} y 
 */
function activeSprites(x, y) {
    for(let i = 0; i < data.sprites.length; i++) {
        if(Math.floor(data.sprites[i].x) == Math.floor(x) && Math.floor(data.sprites[i].y) == Math.floor(y)) {
            data.sprites[i].active = true;
        }
    }
}

/**
 * Inactive all of the sprites
 */
function inativeSprites() {
    for(let i = 0; i < data.sprites.length; i++) {
        data.sprites[i].active = false;
    }
}

/**
 * Draw rect in the buffer
 * @param {number} x1 
 * @param {number} x2 
 * @param {number} y1 
 * @param {number} y2 
 * @param {Color} color 
 */
function drawRect(x1, x2, y1, y2, color) {
    for(let x = x1; x < x2; x++) {
        if(x < 0) continue;
        if(x > data.projection.width) continue;
        drawLine(x, y1, y2, color);
    }
}

/**
 * Find the coordinates for all activated sprites and draw it in the projection
 */
function drawSprites() {
    for(let i = 0; i < data.sprites.length; i++) {
        if(data.sprites[i].active) {

            let sprite = data.sprites_texture_data.find(elem => elem.id === data.sprites[i].id).state_sprite_data[data.sprites[i].state - 1];
            // Get X and Y coords in relation of the player coords
            let spriteXRelative = data.sprites[i].x - data.player.x;
            let spriteYRelative = data.sprites[i].y - data.player.y;

            // Get angle of the sprite in relation of the player angle
            let spriteAngleRadians = Math.atan2(spriteYRelative, spriteXRelative);
            let spriteAngle = radiansToDegrees(spriteAngleRadians) - Math.floor(data.player.angle - data.player.halfFov);

            // Sprite angle checking
            if(spriteAngle > 360) spriteAngle -= 360;
            if(spriteAngle < 0) spriteAngle += 360;

            // Three rule to discover the x position of the script
            let spriteX = Math.floor(spriteAngle * data.projection.width / data.player.fov);

            // SpriteX right position fix
            // if(spriteX > data.projection.width) {
            //     spriteX %= data.projection.width;
            //     spriteX -= data.projection.width;
            // }


            // Get the distance of the sprite (Pythagoras theorem)
            let distance = Math.sqrt(Math.pow(data.player.x - data.sprites[i].x, 2) + Math.pow(data.player.y - data.sprites[i].y, 2));

            // Calc sprite width and height
            // let spriteHeight = Math.floor((sprite.height) / distance);
            let spriteWidth = Math.floor(sprite.width / distance);
            let spriteHeight = Math.floor(data.projection.height / distance);
            if(data.projection.middle > spriteX - spriteWidth / 2 && data.projection.middle < spriteX + spriteWidth / 2){
                data.sprites[i].in_attack = true
            }
            else {
                data.sprites[i].in_attack = false
            }

            // Draw the sprite
            drawSprite(spriteX, spriteWidth, spriteHeight, sprite, data.sprites[i], radiansToDegrees(spriteAngleRadians), distance);
        }
    }
}

/**
 * Draw the sprite in the projeciton position
 * @param {number} xProjection 
 * @param {number} spriteWidth 
 * @param {number} spriteHeight 
 * @param {Object} sprite 
 */
function drawSprite(xProjection, spriteWidth, spriteHeight, sprite, item, spriteAngleRadians, distance) {
    let start_draw = Math.round(xProjection - spriteWidth / 2)
    let s_w = sprite.width
    let s_w_offset = 0
    let s_w_o = 0
    if((buffer[start_draw] < distance && buffer[start_draw + spriteWidth - 1] < distance)){
        return;
    }
    else if(buffer[start_draw] < distance){
        for(let i = start_draw; i < start_draw + spriteWidth; i++){
            if( buffer[i] > distance){
                s_w_offset = s_w * ( (i - start_draw) / spriteWidth)
                s_w_o = (i - start_draw)
                s_w *= ( spriteWidth - (i - start_draw) )/ spriteWidth
                spriteWidth -= (i - start_draw)
                break
            }
        }
    }
    else if(buffer[start_draw + spriteWidth - 1] < distance){
        for(let i = start_draw; i < start_draw + spriteWidth; i++){
            if(buffer[i] < distance){
                s_w *= (i - start_draw) / spriteWidth
                spriteWidth -= spriteWidth - (i - start_draw)
                break
            }
        }
    }


    // Decrement halfwidth of the sprite to consider the middle of the sprite to draw 
    // xProjection = xProjection - sprite.width;
    let offset = 0
    spriteAngleRadians = (spriteAngleRadians + 360) % 360

    if(item.state != item.previos_state){
        item.frame = 0
        item.frame_timer = 0
    }
    else {
        if(item.state == 1){
            item.frame = 0
        }
        else {
            item.frame_timer ++
            if(item.frame_timer > 40){
                item.frame_timer = 0
                item.frame ++
                if(item.frame > 5){
                    item.frame = 0
                }
            }
        }
    }

    if(spriteAngleRadians){
        let angle_dif = spriteAngleRadians - item.angle
        angle_dif = (angle_dif + 360) % 360
        if(angle_dif < 157.5 && angle_dif > 112.5){
            offset = 7
        }
        else if(angle_dif < 112.5 && angle_dif > 67.5){
            offset = 6
        }
        else if(angle_dif < 67.5 && angle_dif > 22.5){
            offset = 5
        }
        else if(angle_dif > 202.5 && angle_dif < 247.5){
            offset = 1
        }
        else if(angle_dif > 247.5 && angle_dif < 292.5){
            offset = 2
        }
        else if(angle_dif > 292.5 && angle_dif <  337.5){
            offset = 3
        }
        else if((angle_dif > 337.5 && angle_dif < 360) || (angle_dif > 0 && angle_dif < 22.5)){
            offset = 4
        }
        screenContext.fillText(item.nick + '(' + item.hp + ')', xProjection - 10, data.projection.halfHeight - spriteHeight / 2)
    }
    // Define the projection incrementers for draw
    // let xIncrementer = (spriteWidth) / sprite.width;
    // let yIncrementer = (spriteHeight * 2) / sprite.height;
    screenContext.font = "12px serif";
    screenContext.fillStyle = 'white'

    screenContext.drawImage(sprite.img,
        sprite.width  * offset + s_w_offset,
        sprite.height * item.frame,
        s_w,
        sprite.height,
        start_draw + s_w_o,
        data.projection.halfHeight - spriteHeight / 2,
        spriteWidth,
        spriteHeight
    )

    // Iterate sprite width and height
    // for(let spriteX = 0; spriteX < sprite.width; spriteX += 1) {
    //
    //     // Define the Y cursor to draw
    //     let yProjection = data.projection.halfHeight - spriteHeight;
    //
    //     for(let spriteY = 0; spriteY < sprite.height; spriteY++) {
    //         let color = sprite.data[spriteX + spriteY * sprite.width];
    //         drawRect(xProjection, xProjection + xIncrementer, yProjection, yProjection + yIncrementer, color);
    //
    //         // Increment Y
    //         yProjection += yIncrementer;
    //     }
    //
    //     // Increment X
    //     xProjection += xIncrementer;
    // }
    
}