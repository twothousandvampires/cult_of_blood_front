import Color from "./Color.js";
import LocalMath from "./LocalMath.js";

export default class Render{

    static sprites_texture_data = {
        'speed_pu': {
            state_sprite_data: [
                {
                    src: './sprites/game/Spell_Haste.gif',
                    width: 68,
                    height: 52,
                    simple: true
                },
            ],
        },
        'energy_pu': {
            state_sprite_data: [
                {
                    src: './sprites/game/Spell_Mind_Blast.gif',
                    width: 77,
                    height: 52,
                    simple: true
                },
            ],
        },
        'power_pu': {
            state_sprite_data: [
                {
                    src: './sprites/game/Spell_Power.gif',
                    width: 68,
                    height: 52,
                    simple: true
                },
            ],
        },
        'life_pu': {
            state_sprite_data: [
                {
                    src: './sprites/game/Spell_First_Aid.gif',
                    width: 68,
                    height: 52,
                    simple: true
                },
            ],
        },
        'arrow_pu': {
            state_sprite_data: [
                {
                    src: './sprites/game/Spell_Flame_Arrow.gif',
                    width: 86,
                    height: 52,
                    simple: true
                },
            ],
        },
        'ball_lightning_pu': {
            state_sprite_data: [
                {
                    src: './sprites/game/Spell_Static_Charge.gif',
                    width: 68,
                    height: 54,
                    simple: true
                },
            ],
        },
        'rail_lightning_pu': {
            state_sprite_data: [
                {
                    src: './sprites/game/Spell_Lightning_Bolt.gif',
                    width: 92,
                    height: 52,
                    simple: true
                },
            ],
        },
        'dark_skull_pu': {
            state_sprite_data: [
                {
                    src: './sprites/game/Spell_Toxic_Cloud.gif',
                    width: 97,
                    height: 52,
                    simple: true
                },
            ],
        },
        'ice_shard_pu': {
            state_sprite_data: [
                {
                    src: './sprites/game/Spell_Cold_Beam.gif',
                    width: 99,
                    height: 53,
                    simple: true
                },
            ],
        },
        'fireball_pu': {
            state_sprite_data: [
                {
                    src: './sprites/game/Spell_Fireball.gif',
                    width: 68,
                    height: 52,
                    simple: true
                },
            ],
        },
        'blood_offering_pu': {
            state_sprite_data: [
                {
                    src: './sprites/game/blood_offering.png',
                    width: 40,
                    height: 40,
                    simple: true
                },
            ],
        },
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
            sprite_data: {
                max_frame: 5
            },
            state_sprite_data: [
                {
                    src: './sprites/skeleton/skeleton_idle.png',
                    width: 220,
                    height: 300,
                    game_width: 110,
                    game_height: 150,
                },
                {
                    src: './sprites/skeleton/skeleton_walk.png',
                    width: 220,
                    height: 300,
                    game_width: 110,
                    game_height: 150,
                },
                {
                    src: './sprites/skeleton/skeleton_attack.png',
                    width: 220,
                    height: 300,
                    game_width: 110,
                    game_height: 150,
                },
                {
                    src: './sprites/skeleton/skeleton_dead.png',
                    width: 220,
                    height: 300,
                    game_width: 110,
                    game_height: 150,
                }
            ],
        },
        'sun_follower': {
            sprite_data: {
                max_frame: 7
            },
            state_sprite_data: [
                {
                    src: './sprites/sun follower/sun_follower_idle.png',
                    width: 200,
                    height: 220,
                    game_width: 110,
                    game_height: 150,
                },
                {
                    src: './sprites/sun follower/sun_follower_walk.png',
                    width: 200,
                    height: 220,
                    game_width: 110,
                    game_height: 150,
                },
                {
                    src: './sprites/sun follower/sun_follower_attack.png',
                    width: 200,
                    height: 220,
                    game_width: 110,
                    game_height: 150,
                },
                {
                    src: './sprites/sun follower/sun_follower_dead.png',
                    width: 200,
                    height: 220,
                    game_width: 110,
                    game_height: 150,
                }
            ],
        },
        'titan': {
            sprite_data: {
                max_frame: 5
            },
            state_sprite_data: [
                {
                    src: './sprites/titan/titan_idle.png',
                    width: 205,
                    height: 375,
                    game_width: 110,
                    game_height: 150,
                },
                {
                    src: './sprites/titan/titan_walk.png',
                    width: 205,
                    height: 375,
                    game_width: 110,
                    game_height: 150,
                },
                {
                    src: './sprites/titan/titan_attack.png',
                    width: 205,
                    height: 375,
                    game_width: 110,
                    game_height: 150,
                },
                {
                    src: './sprites/titan/titan_dead.png',
                    width: 205,
                    height: 375,
                    game_width: 110,
                    game_height: 150,
                }
            ],
        },
        'ball_lightning':{
            state_sprite_data: [
                {
                    src: './sprites/spells/ball_lightning.png',
                    width: 110,
                    height: 110,
                    simple: true
                },
            ],
        },
        'rail_lightning':{
            state_sprite_data: [
                {
                    src: './sprites/effect/rail_lightning.png',
                    width: 60,
                    height: 62,
                    simple: true
                },
            ],
        },
        'dark_skull':{
            state_sprite_data: [
                {
                    src: './sprites/spells/dark_skull.png',
                    width: 41,
                    height: 43,
                    simple: true
                },
            ],
        },
        'big_dark_skull':{
            state_sprite_data: [
                {
                    src: './sprites/spells/big_dark_skull.png',
                    width: 70,
                    height: 80,
                    simple: true
                },
            ],
        },
        'ice_shard':{
            state_sprite_data: [
                {
                    src: './sprites/spells/ice_shard.png',
                    width: 100,
                    height: 95,
                    simple: true
                },
            ],
        },
        'fireball':{
            state_sprite_data: [
                {
                    src: './sprites/spells/fireball.png',
                    width: 157,
                    height: 144,
                    simple: true
                },
            ],
        },
        'druid':{
            sprite_data: {
                max_frame: 5
            },
            state_sprite_data: [
                {
                    src: './sprites/druid/druid_idle.png',
                    width: 186,
                    height: 294,
                    game_width: 110,
                    game_height: 150,
                },
                {
                    src: './sprites/druid/druid_walk.png',
                    width: 186,
                    height: 292,
                    game_width: 110,
                    game_height: 150,
                },
                {
                    src: './sprites/druid/druid_attack.png',
                    width: 186,
                    height: 294,
                    game_width: 110,
                    game_height: 150,
                },
                {
                    src: './sprites/druid/druid_dead.png',
                    width: 186,
                    height: 294,
                    game_width: 110,
                    game_height: 150,
                }
            ],
        },
        'statue' : {
            state_sprite_data: [
                {
                    width: 123,
                    height: 329,
                    src: './sprites/map_sprites/statue.png',
                    box_x: 105,
                    box_y: 280
                }
            ]
        },
        'tombstone' : {
            state_sprite_data: [
                {
                    width: 171,
                    height: 466,
                    src: './sprites/map_sprites/tombstone.png',
                    box_x: 30,
                    box_y: 80
                }
            ]
        }
    }

    static getSpriteById(texture_id){
        return Render.sprites_texture_data[texture_id]
    }

    constructor() {
        this.max_distance_to_draw = 7.5
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
                    width: 32,
                    height: 32,
                    id: "graveyard-fence",
                    data: null
                },
                {
                    width: 32,
                    height: 32,
                    id: "texture",
                    data: null
                },
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

        this.buffer = []
        this.delay = 15
    }
    updateLeaderBoard(data){
        let board = document.getElementById('leaderboard_content')
        board.innerHTML = ''

        Object.values(data).forEach(elem => {
            let row = document.createElement('p')

            row.innerText = elem.nick + '   -    ' + elem.kills

            board.appendChild(row)
        })
    }
    updateLog(msg){
        let log = document.getElementById('log')

        let p = document.createElement('p')
        p.innerText = msg

        log.appendChild(p)
    }
    updateSpell(spell){
        let wrap = document.getElementById('spell')
        wrap.innerHTML = ''
        if(spell){
            let img = document.createElement('img')
            img.src = spell.client_img_path

            wrap.appendChild(img)
        }
    }
    drawFrame(game) {
        if(!this.data.map) return
        this.clearScreen();
        this.rayCasting(game.player, game.sprites);
        this.renderBuffer();
        this.drawSprites(game);
        this.drawHud(game.player)
        this.updateHud(game.player)
    }
    updateHud(player){
        if(!player.angle) return
        this.hud_stat_hp.innerText = player.hp
        this.hud_stat_armour.innerText = player.energy
        this.hud_stat_ammo.innerText = player.ammo
        this.hud_stat_speed.innerText = player.movement_speed.toFixed(2)
        this.hud_stat_power.innerText = player.power
    }
    drawHud(player){

        if(!player.game_mode) return

        let sprite = player.game_mode.hud

        this.screenContext.drawImage(sprite.img,
            300 * sprite.frame,
            sprite.y_offset,
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
        this.hud.src = 'left.png'

        this.hud_stat_hp = document.getElementById('player_hud_hp')
        this.hud_stat_armour = document.getElementById('player_hud_armour')
        this.hud_stat_ammo = document.getElementById('player_hud_ammo')
        this.hud_stat_speed = document.getElementById('player_hud_speed')
        this.hud_stat_power = document.getElementById('player_hud_power')
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
        document.getElementById('canvas_wrap').appendChild(screen);
        document.getElementById('player_hud').style.width = screen.width + 'px'

        screen.addEventListener("click", async () => {
            await document.body.requestPointerLock();
        });

        this.screenContext = screen.getContext("2d");
        this.screenContext.scale(this.data.screen.scale, this.data.screen.scale);
        this.screenContext.imageSmoothingEnabled = false;

        this.data.projection.imageData = this.screenContext.createImageData(this.data.projection.width, this.data.projection.height);
        this.data.projection.buffer = this.data.projection.imageData.data;

        this.canvas_x_offet = screen.offsetLeft
        this.canvas_y_offet = screen.offsetTop
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

    drawPixel(x, y, color, distance, player) {
        if(!color.a){
            return
        }
        let b = color.b
        let r = color.r
        let g = color.g

        if(distance && distance >= player.max_distance){
            b = 0
            r = 0
            g = 0
        }

        else if(distance && distance >= player.min_distance){
            let relate_min_distance = distance - player.min_distance
            let dif = player.max_distance - player.min_distance
            let p = relate_min_distance/dif

            b = Math.floor(b - (b * p))
            r = Math.floor(r - (r * p))
            g = Math.floor(g - (g * p))
        }

        let offset = 4 * (Math.floor(x) + Math.floor(y) * this.data.projection.width);
        this.data.projection.buffer[offset  ] = r;
        this.data.projection.buffer[offset+1] = g;
        this.data.projection.buffer[offset+2] = b;
        this.data.projection.buffer[offset+3] = color.a;
    }

   drawLine(x1, y1, y2, color, distance, player) {
        for(let y = y1; y < y2; y++) {
            this.drawPixel(x1, y, color, distance, player);
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
            let tile = this.data.map.layout[Math.floor(tiley)][Math.floor(tilex)]

            // todo texture under sprite
            // Get texture
            let texture = this.data.floorTextures[0]

            if(!texture) {
                continue
            }

            // Define texture coords
            let texture_x = (Math.floor(tilex * texture.width)) % texture.width
            let texture_y = (Math.floor(tiley * texture.height)) % texture.height

            // Get pixel color
            let color = texture.data[texture_x + texture_y * texture.width];
            this.drawPixel(x1, y, color, distance, player)
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
        let ray_angle = player.angle - player.halfFov;
        for(let rayCount = 0; rayCount < this.data.projection.width; rayCount++) {

            let ray = {
                x: player.x,
                y: player.y
            }

            let ray_cos = Math.cos(LocalMath.degreeToRadians(ray_angle)) / this.data.rayCasting.precision;
            let ray_sin = Math.sin(LocalMath.degreeToRadians(ray_angle)) / this.data.rayCasting.precision;

            let wall = 0;

            while(!this.data.map.uncasting.includes(wall)) {
                ray.x += ray_cos;
                ray.y += ray_sin;
                wall = this.data.map.layout[Math.floor(ray.y)][Math.floor(ray.x)];
            }

            let distance = Math.sqrt(Math.pow(player.x - ray.x, 2) + Math.pow(player.y - ray.y, 2));

            distance = distance * Math.cos(LocalMath.degreeToRadians(ray_angle - player.angle));

            let wallHeight = Math.floor(this.data.projection.halfHeight / distance);

            let texture = this.data.textures[wall - 1];



            this.drawBackground(rayCount, 0, this.data.projection.height, this.data.backgrounds[0], player);
            if(texture){
                let texturePositionX = Math.floor((texture.width * (ray.x + ray.y)) % texture.width);
                this.drawTexture(rayCount, wallHeight, texturePositionX, texture, distance, player);
            }

            this.drawFloor(rayCount, wallHeight, ray_angle, player)
            this.buffer.push(distance)
            if(ray_angle > player.angle - player.halfFov && ray_angle <  player.angle + player.halfFov){
                sprites.forEach(s => {
                    if (!s.active && !s.marked) {
                        let x1 = player.x, y1 = player.y, x2 = ray.x, y2 = ray.y, x3 = s.x, y3 = s.y;

                        let double_x = (x1 * x1 * x3 - 2 * x1 * x2 * x3 + x2 * x2 * x3 + x2 *
                            (y1 - y2) * (y1 - y3) - x1 * (y1 - y2) * (y2 - y3)) / ((x1 - x2) *
                            (x1 - x2) + (y1 - y2) * (y1 - y2));
                        let double_y = (x2 * x2 * y1 + x1 * x1 * y2 + x2 * x3 * (y2 - y1) - x1 *
                            (x3 * (y2 - y1) + x2 * (y1 + y2)) + (y1 - y2) * (y1 - y2) * y3) / ((
                            x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
                        let d = Math.sqrt(Math.pow(s.x - double_x, 2) + Math.pow(s.y - double_y, 2));
                        if(d < 0.15 && Math.sqrt(Math.pow(player.x - double_x, 2) + Math.pow(player.y - double_y, 2)) < distance){
                            s.active = true
                            s.marked = true
                        }
                    }
                })
            }
            ray_angle += this.data.rayCasting.incrementAngle;
        }
    }

    /**
     * Clear screen
     */
    clearScreen() {
        this.screenContext.clearRect(0, 0, this.data.projection.width, this.data.projection.height);
    }

    drawSprites(game) {
        let to_draw = []

        for(let i = 0; i < game.sprites.length; i++) {
            game.sprites[i]?.act(game)
            if(game.sprites[i] && game.sprites[i].active){
                to_draw.push(game.sprites[i])
            }
        }

        to_draw.sort((a, b) => {
            return Math.sqrt(Math.pow(game.player.x - b.x, 2) + Math.pow(game.player.y - b.y, 2)) -
                   Math.sqrt(Math.pow(game.player.x - a.x, 2) + Math.pow(game.player.y - a.y, 2))
        })

        for(let i = 0; i < to_draw.length; i++) {
            to_draw[i].draw(game.player, this.screenContext, this.buffer, this.data.projection)
        }
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
   drawTexture(x, wallHeight, texturePositionX, texture, distance, player) {
        let yIncrementer = (wallHeight * 2) / texture.height;
        let y = this.data.projection.halfHeight - wallHeight;
        let color = null
        for(let i = 0; i < texture.height; i++) {
            color = texture.data[texturePositionX + i * texture.width];
            this.drawLine(x, y, Math.floor(y + yIncrementer + 2), color, distance, player);
            y += yIncrementer;
        }
    }

    updateMiniMap(player){
        let minimap = document.getElementById('minimap-content')
        minimap.innerHTML = ''

        this.data.map.layout.forEach((row, row_index) => {
            let map_row = document.createElement('div')
            map_row.className = 'minimap-row'
            row.forEach((cell, cell_index) =>{
                let row_cell = document.createElement('div')
                row_cell.className = 'minimap-cell'
                let is_player = Math.floor(player.x) === cell_index && Math.floor(player.y) === row_index
                if(is_player){
                    row_cell.style.backgroundColor = 'yellow'
                }
                else if(this.data.map.power_up_spots.some(pu => pu[0] === cell_index && pu[1] === row_index)){
                    row_cell.style.backgroundColor = 'green'
                }
                else if(!cell){
                    row_cell.style.backgroundColor = 'black'
                }
                else {
                    row_cell.style.backgroundColor = 'white'
                }
                map_row.appendChild(row_cell)
            })

            minimap.appendChild(map_row)
        })
    }

    drawMiniMap(map){
        this.data.map = map
        this.data.map.power_up_spots = map.power_up_spots.map(elem => [Math.floor(elem.x), Math.floor(elem.y)])
        let minimap_name = document.getElementById('minimap-name')
        minimap_name.innerText = map.name
        let minimap = document.getElementById('minimap-content')

        map.layout.forEach((row, row_index) => {
            let map_row = document.createElement('div')
            map_row.className = 'minimap-row'
            row.forEach((cell, cell_index) =>{
                let row_cell = document.createElement('div')
                row_cell.className = 'minimap-cell'
                let is_pu = this.data.map.power_up_spots.some(pu => pu[0] === cell_index && pu[1] === row_index)
                if(is_pu){
                    row_cell.style.backgroundColor = 'green'
                }
                else if(!cell){
                    row_cell.style.backgroundColor = 'black'
                }
                else {
                    row_cell.style.backgroundColor = 'white'
                }
                map_row.appendChild(row_cell)
            })

            minimap.appendChild(map_row)
        })
    }
}