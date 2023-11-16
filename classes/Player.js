import socket from "../socket.js";
export default class Player{
    constructor() {
        this.fov = 60
        this.halfFov = 30
        this.x = 2
        this.y = 2
        this.angle = 0
        this.radius = 20
        this.speed = {
                movement: 0.04,
                rotation: 0.7
        }
        this.arrow_cd = false
        this.state_frame = 0
        this.frame_timer = 0
        this.max_frame_timer = 7
        this.deal_hit = false
        this.attack = false
    }
    playerHit(game){
        for(let i = 0; i < game.sprites.length; i++) {
            let sprite =  game.sprites[i]
            if(sprite === this) continue
            if(!sprite.in_attack) continue
            let distance = Math.sqrt(Math.pow(sprite.x - this.x, 2) + Math.pow(sprite.y - this.y, 2))
            if(distance > 0.8) continue
            socket.emit('hit_player', sprite.id)
        }
    }
    stateFrame(game){
        if(this.attack){
            this.frame_timer++
            if(this.frame_timer >= this.max_frame_timer){
                this.state_frame ++
                this.frame_timer = 0
            }
            if(this.state_frame === 4 && !this.deal_hit){
                this.deal_hit = true
                this.playerHit(game)
            }
            if(this.state_frame > 5){
                this.state_frame = 0
                this.frame_timer = 0
                this.deal_hit = false
                socket.emit('end_attack')
            }
        }
    }
}