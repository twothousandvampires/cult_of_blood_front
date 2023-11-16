import Color from "./Color.js";
import LocalMath from "./LocalMath.js";
export default class Render{

    static sprites_texture_data = {
        'arrow': {
            state_sprite_data: [
                {
                    src: './sprites/arrow/arrow.png',
                    width: 40,
                    height: 40,
                    simple: true
                },
            ],
        },
        'skeleton': {
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
                },
                {
                    src: './sprites/skeleton/skeleton_attack.png',
                    width: 220,
                    height: 300,
                }
            ],
        },
        'titan':{
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
                },
                {
                    src: './sprites/titan/titan_attack.png',
                    width: 270,
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
    }

    static getSpriteById(texture_id){
        return Render.sprites_texture_data[texture_id]
    }

    constructor() {
        this.data = {
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
            textures: [
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
        }

        this.sprites = []
        this.buffer = []
        this.delay = 15
    }
    drawFrame(player, sprites){
        this.clearScreen();
        this.rayCasting(player, sprites);
        this.renderBuffer();
        this.drawSprites(player, sprites);
        this.drawHud(player)
    }
    drawHud(player){
        let y_offset = 0
        if(player.in_block){
            y_offset = 400
        }
        else if(player.attack){
            y_offset = 200
        }
        this.screenContext.drawImage(this.hud,
            300 * player.state_frame,y_offset,
            300,200
            ,0,0,
            this.data.projection.width,
            this.data.projection.height)
    }
    loadImageDataAndInitCanvas(player){
        this.initHud()
        this.initCanvas(player)
        this.loadTextures();
        this.loadBackgrounds();
        this.loadSprites();
    }
    initHud(){
        this.hud = new Image()
        this.hud.src = 'hud2.png'
    }
    initCanvas(player){
        this.data.screen.halfWidth = this.data.screen.width / 2;
        this.data.screen.halfHeight = this.data.screen.height / 2;
        this.data.projection.width = this.data.screen.width / this.data.screen.scale;
        this.data.projection.height = this.data.screen.height / this.data.screen.scale;
        this.data.projection.middle = this.data.projection.width / 2
        this.data.projection.halfWidth = this.data.projection.width / 2;
        this.data.projection.halfHeight = this.data.projection.height / 2;
        this.data.rayCasting.incrementAngle = player.fov / this.data.projection.width;

        const screen = document.createElement('canvas');
        screen.width = this.data.screen.width;
        screen.height = this.data.screen.height;
        screen.style.border = "1px solid black";
        document.body.appendChild(screen);

        this.screenContext = screen.getContext("2d");
        this.screenContext.scale(this.data.screen.scale, this.data.screen.scale);
        this.screenContext.imageSmoothingEnabled = false;

        this.data.projection.imageData = this.screenContext.createImageData(this.data.projection.width, this.data.projection.height);
        this.data.projection.buffer = this.data.projection.imageData.data;
    }
    loadTextures(){
        for(let i = 0; i < this.data.textures.length; i++) {
            if(this.data.textures[i].id) {
                this.data.textures[i].data = this.getTextureData(this.data.textures[i]);
            }
        }
        for(let i = 0; i < this.data.floorTextures.length; i++) {
            if(this.data.floorTextures[i].id) {
                this.data.floorTextures[i].data = this.getTextureData(this.data.floorTextures[i]);
            }
        }
    }

    loadBackgrounds(){
        for(let i = 0; i < this.data.backgrounds.length; i++) {
            if(this.data.backgrounds[i].id) {
                this.data.backgrounds[i].data = this.getTextureData(this.data.backgrounds[i]);
            }
        }
    }

    loadSprites(){
        for(let item of Object.values(Render.sprites_texture_data)) {
            for(let j = 0 ; j < item.state_sprite_data.length; j++){
                item.state_sprite_data[j].img = new Image()
                item.state_sprite_data[j].img.src = item.state_sprite_data[j].src
            }
        }
    }

    getTextureData(texture){
        let image = document.getElementById(texture.id);
        let canvas = document.createElement('canvas');
        canvas.width = texture.width;
        canvas.height = texture.height;
        let canvasContext = canvas.getContext('2d');
        canvasContext.clearRect(0,0, texture.width, texture.height)
        canvasContext.drawImage(image, 0, 0, texture.width, texture.height);
        let imageData = canvasContext.getImageData(0, 0, texture.width, texture.height).data;
        return this.parseImageData(imageData);
    }

    parseImageData(imageData){
        let colorArray = [];
        for (let i = 0; i < imageData.length; i += 4) {
            colorArray.push(new Color(imageData[i], imageData[i + 1], imageData[i + 2],  imageData[i + 3]));
        }
        return colorArray;
    }

    drawPixel(x, y, color, distance) {
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
        let offset = 4 * (Math.floor(x) + Math.floor(y) * this.data.projection.width);
        this.data.projection.buffer[offset  ] = r;
        this.data.projection.buffer[offset+1] = g;
        this.data.projection.buffer[offset+2] = b;
        this.data.projection.buffer[offset+3] = color.a;
    }

   drawLine(x1, y1, y2, color, distance) {
        for(let y = y1; y < y2; y++) {
            this.drawPixel(x1, y, color, distance);
        }
    }

    drawFloor(x1, wallHeight, rayAngle, player) {

        let start = this.data.projection.halfHeight + wallHeight + 1;
        let directionCos = Math.cos(LocalMath.degreeToRadians(rayAngle))
        let directionSin = Math.sin(LocalMath.degreeToRadians(rayAngle))
        let playerAngle = player.angle
        for(let y = start; y <this. data.projection.height; y++) {
            // Create distance and calculate it
            let distance = this.data.projection.height / (2 * y - this.data.projection.height)

            // Get the tile position
            let tilex = distance * directionCos
            let tiley = distance * directionSin
            // todo player
            tilex += player.x
            tiley += player.y
            let tile = this.data.map[Math.floor(tiley)][Math.floor(tilex)]

            // Get texture
            let texture = this.data.floorTextures[tile]

            if(!texture) {
                continue
            }

            // Define texture coords
            let texture_x = (Math.floor(tilex * texture.width)) % texture.width
            let texture_y = (Math.floor(tiley * texture.height)) % texture.height

            // Get pixel color
            let color = texture.data[texture_x + texture_y * texture.width];
            this.drawPixel(x1, y, color, distance)
        }
    }
    renderBuffer() {
        let canvas = document.createElement('canvas');
        canvas.width = this.data.projection.width;
        canvas.height = this.data.projection.height;
        canvas.getContext('2d').putImageData(this.data.projection.imageData, 0, 0);
        this.screenContext.drawImage(canvas, 0, 0);
    }
   rayCasting(player, sprites) {
        this.buffer = []
        let rayAngle = player.angle - player.halfFov;
        for(let rayCount = 0; rayCount < this.data.projection.width; rayCount++) {

            // Ray data
            let ray = {
                x: player.x,
                y: player.y
            }

            let rayCos = Math.cos(LocalMath.degreeToRadians(rayAngle)) / this.data.rayCasting.precision;
            let raySin = Math.sin(LocalMath.degreeToRadians(rayAngle)) / this.data.rayCasting.precision;

            let wall = 0;
            while(wall == 0) {
                ray.x += rayCos;
                ray.y += raySin;
                wall = this.data.map[Math.floor(ray.y)][Math.floor(ray.x)];
                this.activeSprites(ray.x, ray.y, sprites);
            }

            let distance = Math.sqrt(Math.pow(player.x - ray.x, 2) + Math.pow(player.y - ray.y, 2));

            distance = distance * Math.cos(LocalMath.degreeToRadians(rayAngle - player.angle));

            let wallHeight = Math.floor(this.data.projection.halfHeight / distance);

            let texture = this.data.textures[wall - 1];

            let texturePositionX = Math.floor((texture.width * (ray.x + ray.y)) % texture.width);

            this.drawBackground(rayCount, 0, this.data.projection.halfHeight - wallHeight, this.data.backgrounds[0], player);
            this.drawTexture(rayCount, wallHeight, texturePositionX, texture, distance);
            this.drawFloor(rayCount, wallHeight, rayAngle, player)
            this.buffer.push(distance)

            rayAngle += this.data.rayCasting.incrementAngle;
        }
    }

    /**
     * Clear screen
     */
    clearScreen() {
        this.screenContext.clearRect(0, 0, this.data.projection.width, this.data.projection.height);
    }

    activeSprites(x, y, sprites) {
        for(let i = 0; i < sprites.length; i++) {
            if(Math.floor(sprites[i].x) == Math.floor(x) && Math.floor(sprites[i].y) == Math.floor(y)) {
                sprites[i].active = true;
            }
        }
    }

    drawSprites(player, sprites) {
        for(let i = 0; i < sprites.length; i++) {
            if(sprites[i].active) {
                sprites[i].draw(player, this.screenContext, this.buffer, this.data.projection)
            }
        }
    }
    drawSprite(xProjection, spriteWidth, spriteHeight, sprite, item, spriteAngleRadians, distance) {
        let start_draw = Math.round(xProjection - spriteWidth / 2)
        let s_w = sprite.width
        let s_w_offset = 0
        let s_w_o = 0
        if((this.buffer[start_draw] < distance && this.buffer[start_draw + spriteWidth - 1] < distance)){
            return;
        }
        else if(this.buffer[start_draw] < distance){
            for(let i = start_draw; i < start_draw + spriteWidth; i++){
                if(this.buffer[i] > distance){
                    s_w_offset = s_w * ( (i - start_draw) / spriteWidth)
                    s_w_o = (i - start_draw)
                    s_w *= ( spriteWidth - (i - start_draw) )/ spriteWidth
                    spriteWidth -= (i - start_draw)
                    break
                }
            }
        }
        else if(this.buffer[start_draw + spriteWidth - 1] < distance){
            for(let i = start_draw; i < start_draw + spriteWidth; i++){
                if(this.buffer[i] < distance){
                    s_w *= (i - start_draw) / spriteWidth
                    spriteWidth -= spriteWidth - (i - start_draw)
                    break
                }
            }
        }

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

        }
        if(!item.simple){
            this.screenContext.fillText(item.nick + '(' + item.hp + ')', xProjection - 10, this.data.projection.halfHeight - spriteHeight / 2)
            this.screenContext.font = "12px serif";
            this.screenContext.fillStyle = 'white'
        }

       this.screenContext.drawImage(sprite.img,
            sprite.width  * offset + s_w_offset,
            sprite.height * item.frame,
            s_w,
            sprite.height,
            start_draw + s_w_o,
            this.data.projection.halfHeight - spriteHeight / 2,
            spriteWidth,
            spriteHeight
        )
    }

    drawBackground(x, y1, y2, background, player) {
        let offset = (player.angle + x);
        for(let y = y1; y < y2; y++) {
            let textureX = Math.floor(offset % background.width);
            let textureY = Math.floor(y % background.height);
            let color = background.data[textureX + textureY * background.width];
            this.drawPixel(x, y, color);
        }
    }
   drawTexture(x, wallHeight, texturePositionX, texture, distance) {
        let yIncrementer = (wallHeight * 2) / texture.height;
        let y = this.data.projection.halfHeight - wallHeight;
        let color = null
        for(let i = 0; i < texture.height; i++) {
            if(texture.id) {
                color = texture.data[texturePositionX + i * texture.width];
            } else {
                color = texture.colors[texture.bitmap[i][texturePositionX]];
            }
            this.drawLine(x, y, Math.floor(y + yIncrementer + 2), color, distance);
            y += yIncrementer;
        }
    }
}