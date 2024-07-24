import socket from "../socket.js";
import CastModeDefault from "./State/CastModeDefault.js";
import WeaponModeSword from "./State/WeaponModeSword.js";
import WeaponModeStaff from "./State/WeaponModeStaff.js";
import WeaponMode from "./State/WeaponMode.js";
import CastModeChanneling from "./State/CastModeChanneling.js";
export default class Player{
    static STATE_DEAD = 4
    constructor(game) {
        this.game = game
        this.fov = 60
        this.halfFov = 30
        this.x = 2
        this.y = 2
        this.angle = 0
        this.radius = 20
        this.movement_speed = 0.04
        this.arrow_cd = false
        this.deal_hit = false
        this.is_block = false
        this.is_attack = false
        this.spell_cd = false
        this.is_special = false
        this.max_distance = 5
        this.min_distance = 1
    }
    getGameMode(){
        return this.game_mode.getMode()
    }
    setWeaponMode(weapon_type){
        if(!weapon_type) return

        if(weapon_type == WeaponMode.WEAPON_SWORD){
            alert(weapon_type)
            this.game_mode = new WeaponModeSword(this)
        }
        else if(weapon_type == WeaponMode.WEAPON_STAFF){
            this.game_mode = new WeaponModeStaff(this)
        }
    }
    setCastMode(spell){
        if(!spell) return
        console.log(spell)
        if(spell.channeling){
            this.game_mode = new CastModeChanneling(this)
        }else {
            this.game_mode = new CastModeDefault(this)
        }
    }
    endAttack(){
        socket.emit('end_attack')
        this.deal_hit = false
    }
    playerHit(){
        this.deal_hit = true
        let game = this.game
        for(let i = 0; i < game.sprites.length; i++) {
            let sprite =  game.sprites[i]
            if(sprite === this) continue
            if(!sprite.in_attack) continue
            let distance = Math.sqrt(Math.pow(sprite.x - this.x, 2) + Math.pow(sprite.y - this.y, 2))
            let attack_add_distance = this.move_forward ? 0.2 : 0
            let total_range = 0.8 + attack_add_distance
            if(distance > total_range) continue
            socket.emit('hit_player', sprite.id)
        }
    }
    stateFrame(inputs){
        if(!this.game_mode) return

        this.game_mode.act(inputs)
    }
    attack(){
        if(!this.game_mode) return

        this.game_mode.attack()
    }

    special(inputs){
        if(!this.game_mode) return

        this.game_mode.special(inputs)
    }
    fireArrow(){
        if(this.arrow_cd) return

        this.arrow_cd = true
        socket.emit('arrow_shot')
        setTimeout(()=> {
            this.arrow_cd = false
        },2000)
    }
    changeGameState(){
        socket.emit('change_game_state')
    }
    endCast(){
        socket.emit('end_attack')
    }

    endSpecialCast(){
        socket.emit('end_special')
    }

    specialCast(){
        if(this.casted) return

        this.casted = true

        socket.emit('special_cast')
        setTimeout(()=> {
            this.spell.is_cd = false
            this.casted = false

        },this.spell.special_cd)
    }

    cast(){
        if(this.spell.channeling){
            if(this.spell.is_cd) return
            this.spell.is_cd = true
            socket.emit('cast')
            setTimeout(()=> {
                this.spell.is_cd = false
            },this.spell.cd)
        }
        else {
            if(this.casted) return

            this.casted = true

            socket.emit('cast')
            setTimeout(()=> {
                this.spell.is_cd = false
                this.casted = false
            },this.spell.cd)
        }
    }

    newSpell(spell){
        this.spell = spell
        this.spell.is_cd = false
        this.is_special = false
        this.casted = false

        if(this.game_mode instanceof WeaponModeSword){

        }
        else {
            this.setCastMode(spell)
        }
    }

    update(back_end_player){
        this.angle = back_end_player.angle
        this.x += (back_end_player.x - this.x) * 0.5
        this.y += (back_end_player.y - this.y) * 0.5
        this.hp = back_end_player.hp
        this.state = back_end_player.state
        this.is_attack = back_end_player.is_attack
        this.in_block = back_end_player.in_block
        this.movement_speed = back_end_player.movement_speed
        this.energy = back_end_player.energy
        this.ammo = back_end_player.ammo
        this.move_forward = back_end_player.move_forward
        this.power = back_end_player.power
        this.weapon = back_end_player.weapon
        this.is_special = back_end_player.is_special
        this.min_distance = back_end_player.min_distance
        this.max_distance = back_end_player.max_distance
    }
}