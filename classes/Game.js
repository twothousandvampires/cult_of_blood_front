import Render from "./Render.js";
import socket from "../socket.js";
import Input from "./Input.js";
import LocalMath from "./LocalMath.js";
import Arrow from "./game_object/Arrow.js";
import BackEndPlayer from "./game_object/Player.js";
import Player from "./Player.js";
import PowerUp from "./game_object/PowerUp.js";
import SpellSpriteCreator from "./creators/SpellSpriteCreator.js";

export default class Game{
    constructor() {
        this.render = new Render()
        this.sprites = []
        this.loop = undefined
        this.socket_id = undefined
        this.role = undefined
        this.player = new Player(this)
        this.backend_players = undefined
        this.inputs = new Input()
    }
    getRole(){
        socket.emit('get_role')
    }
    prepare(){
        this.render.loadImageDataAndInitCanvas(this.player)
    }
    initSocketAndInput(){

        socket.on('set_role', (role, socket_id) => {
            this.socket_id = socket_id
            this.role = role
            if(this.role === 'player'){
                let div = document.getElementById('nick_input')
                div.style.display = 'flex'
                div.addEventListener('keypress', async (e) => {
                    if (e.key === 'Enter') {
                        socket.emit('init', document.getElementById('nick').value,  document.getElementById('skin').value)
                        div.style.display = 'none'

                        let pre = document.getElementById('pre-game');
                        pre.style.display = 'none'

                        let game = document.getElementById('game')
                        game.style.display = 'flex'

                        await document.body.requestPointerLock();

                        this.startLoop()
                    }
                })

            }
        })
        socket.on("delete_player", (socket_id) => {
            this.sprites = this.sprites.filter(elem => elem.id !== socket_id)
        })
        socket.on('update_leaderboard', (data)=>{
            this.render.updateLeaderBoard(data)
        })
        socket.on('update_log', (msg)=>{
            this.render.updateLog(msg)
        })
        socket.on('modal', (data) => {
            let tick = 0
            let p = document.getElementsByTagName('body')[0]
            let modal = document.createElement('p')
            modal.style.color = data.color
            modal.style.top = 400 - 50 + 'px'
            modal.style.left = 600 - 50 + this.render.canvas_x_offet + 'px'
            modal.innerText = data.value
            modal.className  = 'modal'
            p.appendChild(modal)
            let modal_interval = setInterval(() => {
                if(tick == 5){
                    p.removeChild(modal)
                    clearInterval(modal_interval)
                }
                tick ++
                modal.style.top = parseInt(modal.style.top) - 10 + 'px'
            },50)
        })
        socket.on('dead' ,()=>{
            this.createDeadModal()
        })
        socket.on('updateArrows', (data) => {
            data.forEach(elem => {
                let exist = this.sprites.find(s_elem => s_elem.id === elem.id )
                if(exist){
                    exist.x += (elem.x - exist.x) * 0.5
                    exist.y += (elem.y - exist.y) * 0.5
                    exist.angle = elem.angle
                }
                else {
                    let new_arrow_sprite = new Arrow(elem.x, elem.y, elem.angle, elem.id, 'arrow')
                    this.sprites.push(new_arrow_sprite)
                }
            })
        })
        socket.on('updateSpells', (data) => {
            data.forEach(elem => {
                let exist = this.sprites.find(s_elem => s_elem.id === elem.id )
                if(exist){
                    exist.x += (elem.x - exist.x) * 0.5
                    exist.y += (elem.y - exist.y) * 0.5
                    exist.angle = elem.angle
                    if(elem.stage){
                        exist.stage = elem.stage
                    }
                }
                else {
                    let new_arrow_sprite = SpellSpriteCreator.create(elem.x, elem.y, elem.angle, elem.id, elem.texture_id)
                    this.sprites.push(new_arrow_sprite)
                }
            })
        })
        socket.on('addEffect', (data) => {
            data.forEach(elem => {
                let new_sprite = SpellSpriteCreator.create(elem.x, elem.y, elem.angle, elem.id, elem.texture_id)
                this.sprites.push(new_sprite)
            })
        })
        socket.on('update_spell', (spell) => {
            this.player.newSpell(spell)
            this.render.updateSpell(this.player.spell)
        })
        socket.on('update_map', (map) => {
            this.render.drawMiniMap(map)
        })
        socket.on('update_power_ups', (data) => {
            data.forEach(elem => {
                let exist = this.sprites.find(s_elem => s_elem.id === elem.id )
                if(!exist){
                    let new_arrow_sprite = new PowerUp(elem.x, elem.y, elem.id, elem.texture_id)
                    this.sprites.push(new_arrow_sprite)
                }
            })
        })
        socket.on('delete_sprite', (id) => {
            this.sprites = this.sprites.filter(elem => elem.id !== id)
        })
        socket.on('set_cast_mode', (server_data) => {
            this.player.setCastMode(server_data)
        })
        socket.on('set_vision_distance', (server_data) => {
            this.player.min_distance = server_data[0]
            this.player.max_distance = server_data[1]
        })
        socket.on('set_weapon_mode', (server_data) => {
            this.player.setWeaponMode(server_data)
        })
        socket.on("updatePlayers", (server_data) => {
            for(let item in server_data){
                const back_end_player = server_data[item]
                if(back_end_player.socket_id === this.socket_id && this.role !== 'spec'){
                    this.player.update(back_end_player)
                }
                else {
                    let exist = this.sprites.find(elem => elem.id === server_data[item].socket_id )
                    if(exist){
                        exist.x += (back_end_player.x - exist.x) * 0.5
                        exist.y += (back_end_player.y - exist.y) * 0.5
                        exist.angle = server_data[item].angle
                        exist.hp = back_end_player.hp
                        exist.previos_state = exist.state
                        exist.state = back_end_player.state
                        exist.is_attack = back_end_player.is_attack
                        exist.in_block = back_end_player.in_block
                    }
                    else {
                        let new_player_sprite = new BackEndPlayer(server_data[item].x,
                            server_data[item].y,
                            server_data[item].angle,
                            server_data[item].socket_id,
                            server_data[item].nick,
                            server_data[item].hp,
                            server_data[item].texture_id,
                            server_data[item].state
                            )
                        this.sprites.push(new_player_sprite)
                    }
                }
            }
        })
    }
    createDeadModal(){
        let div = document.getElementById('dead_modal')
        div.style.display = 'flex'
        let sec = 5
        let int = setInterval(()=>{
            if(sec < 0){
                document.getElementById('go_next').innerText = 'GO!'
                let listener = function (event){
                    if(event.keyCode === 13){
                        socket.emit('revive')
                        div.style.display = 'none'
                        clearInterval(int)
                        window.removeEventListener('keydown', listener)
                    }
                }
                window.addEventListener('keydown', listener)
            }
            else {
                document.getElementById('go_next').innerText = sec
                sec --
            }
        },1000)
    }
    startLoop(){
        this.loop = setInterval(() => {
            this.player.stateFrame(this.inputs)
            this.inactiveSprites();
            this.render.drawFrame(this)
        }, this.render.delay)

        setInterval(() => {
            this.render.updateMiniMap(this.player)
        },1000)

        this.sendInputsToServer = setInterval(() => {
            if(this.player.state === Player.STATE_DEAD) return

            let d = {
                dx: 0,
                dy: 0,
                da: 0,
            }

            if(this.role === 'player'){

                if(this.inputs.is(Input.MOUSE_1)){
                    this.player.attack()
                }
                else if(this.inputs.is(Input.MOUSE_2)){
                    this.player.special()
                }

                if(this.inputs.is(Input.Q_KEY_CODE)){
                    this.player.changeGameState()
                }
                if(this.inputs.is(Input.E_KEY_CODE)){
                    this.player.fireArrow()
                }
                if(this.inputs.is(Input.F_KEY_CODE)){
                   this.player.cast()
                }
            }

            let dx = Math.cos(LocalMath.degreeToRadians(this.player.angle))
            let dy = Math.sin(LocalMath.degreeToRadians(this.player.angle))

            if (this.inputs.is(Input.W_KEY_CODE)) {
                d.dx += dx
                d.dy += dy
                d.move_back = false
                if(!this.inputs.is(Input.S_KEY_CODE)){
                    d.move_forward = true
                }
            }
            if (this.inputs.is(Input.S_KEY_CODE)) {
                d.dx -= dx
                d.dy -= dy
                d.move_forward = false
                if(!this.inputs.is(Input.W_KEY_CODE)){
                    d.move_back = true
                }
            }
            if (this.inputs.is(Input.A_KEY_CODE)) {
                d.dx += Math.cos(LocalMath.degreeToRadians(this.player.angle - 90))
                d.dy += Math.sin(LocalMath.degreeToRadians(this.player.angle - 90))
            }
            if (this.inputs.is(Input.D_KEY_CODE)) {
                d.dx += Math.cos(LocalMath.degreeToRadians(this.player.angle + 90))
                d.dy += Math.sin(LocalMath.degreeToRadians(this.player.angle + 90))
            }
            let sign = this.inputs.move_x < 0 ? -1 : 1
            d.da = Math.ceil(Math.abs(this.inputs.move_x/10)) * sign
            d.dx = d.dx * this.player.movement_speed
            d.dy = d.dy * this.player.movement_speed
            this.inputs.move_x = 0


            let check_x = Math.floor(this.player.x + d.dx + (d.dx < 0 ? -0.3 : 0.3))
            let check_y = Math.floor(this.player.y + d.dy + (d.dy < 0 ? -0.3 : 0.3))

            if(this.render.data.map.unmoveble.includes(this.render.data.map.layout[check_y][Math.floor(this.player.x)])){
                d.dy = 0
            }
            if(this.render.data.map.unmoveble.includes(this.render.data.map.layout[Math.floor(this.player.y)][check_x])){
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
            this.sprites[i].marked = false;
        }
    }

}