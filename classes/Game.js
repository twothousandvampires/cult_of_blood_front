import Render from "./Render.js";
import socket from "../socket.js";
import Input from "./Input.js";
import LocalMath from "./LocalMath.js";
export default class Game{
    constructor() {
        this.render = new Render()
        this.sprites = []
        this.loop = undefined
        this.socket_id = undefined
        this.role = undefined
        this.arrows = []
        this.player = {
            fov: 60,
            halfFov: 30,
            x: 2,
            y: 2,
            angle: 0,
            radius: 20,
            speed: {
                movement: 0.04,
                rotation: 0.7
            }
        }
        this.backend_palyers = undefined
        this.inputs = new Input()
        this.map = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        ]
    }
    prepare(){
        this.render.loadImageDataAndInitCanvas(this.player)
        this.render.data.map = this.map
    }
    initSocketAndInput(){
        socket.on("connect", () => {
            this.socket_id = socket.id
        })
        socket.on("delete_player", (socket_id) => {
            this.sprites = this.sprites.filter(elem => elem.socket_id !== socket_id)
        })
        socket.on('get_role', (role) => {
            this.role = role
            if(this.role === 'player'){
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
        socket.on('updateArrows', (data) => {
            this.arrows = data
        })
        socket.on("updatePlayers", (server_data) => {
            this.backend_palyers = server_data
            for(let item in server_data){
                const back_end_player = server_data[item]

                if(back_end_player.socket_id === this.socket_id && this.role !== 'spec'){
                    this.player.angle = back_end_player.angle
                    this.player.x += (back_end_player.x - this.player.x) * 0.5
                    this.player.y += (back_end_player.y - this.player.y) * 0.5
                    this.player.hp = back_end_player.hp
                    this.player.state = back_end_player.state
                }
                else {
                    let exist = this.sprites.find(elem => elem.socket_id === server_data[item].socket_id )
                    if(exist){
                        exist.x += (back_end_player.x - exist.x) * 0.5
                        exist.y += (back_end_player.y - exist.y) * 0.5
                        exist.angle = server_data[item].angle
                        exist.hp = back_end_player.hp
                        exist.previos_state = exist.state
                        exist.state = back_end_player.state
                    }
                    else {
                        this.sprites.push({
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
    }
    startLoop(){
        this.loop = setInterval(() => {
            this.inactiveSprites();
            this.render.drawFrame(this.player, this.sprites, this.arrows)
        }, this.render.delay);
        this.sendInputsToServer = setInterval(() => {
            let keys = this.inputs.get()
            if(!this.player.attack && keys.mouse_1.pressed){
                this.player.attack = true
                setTimeout(()=>{
                    for(let i = 0; i < this.sprites.length; i++) {
                        let sprite =  this.sprites[i]
                        if(sprite.socket_id === this.socket_id) continue
                        if(!sprite.in_attack) continue
                        let distance = Math.sqrt(Math.pow(sprite.x - this.player.x, 2) + Math.pow(sprite.y - this.player.y, 2))
                        if(distance > 0.8) continue
                        socket.emit('hit_player', sprite.socket_id)
                    }
                    this.player.attack = false
                }, 1500)
            }

            let d = {
                dx: 0,
                dy: 0,
                da: 0
            }
            if (keys.w.pressed) {
                let dx = Math.cos(LocalMath.degreeToRadians(this.player.angle)) * this.player.speed.movement
                let dy = Math.sin(LocalMath.degreeToRadians(this.player.angle)) * this.player.speed.movement
                d.dx += dx
                d.dy += dy
            }
            if (keys.s.pressed) {
                let dx = Math.cos(LocalMath.degreeToRadians(this.player.angle)) * this.player.speed.movement
                let dy = Math.sin(LocalMath.degreeToRadians(this.player.angle)) * this.player.speed.movement
                d.dx -= dx
                d.dy -= dy
            }
            if (keys.a.pressed) {
                let da = -3
                d.da += da
            }
            if (keys.d.pressed) {
                let da = + 3
                d.da += da
            }
            let check_x = Math.floor(this.player.x + d.dx + (d.dx < 0 ? -0.3 : 0.3))
            let check_y = Math.floor(this.player.y + d.dy + (d.dy < 0 ? -0.3 : 0.3))

            if(this.map[check_y][Math.floor(this.player.x)] !== 0){
                d.dy = 0
            }
            if(this.map[Math.floor(this.player.y)][check_x] !== 0){
                d.dx = 0
            }
            if(this.role === 'player'){
                socket.emit('inputs', d)
            }
            else {
                this.player.x += d.dx
                this.player.y += d.dy
                this.player.angle += d.da
                if( this.player.angle > 360)  this.player.angle -= 360
                if( this.player.angle < 0)  this.player.angle += 360
            }
        }, 30)
    }
    inactiveSprites() {
        for(let i = 0; i < this.sprites.length; i++) {
            this.sprites[i].active = false;
        }
    }

}