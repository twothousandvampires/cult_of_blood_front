import CastHudSprite from "../HudSprite/CastHudSprite.js";
import socket from "../../socket.js";
import CastMode from "./CastMode.js";

export default class CastModeDefault extends CastMode{

    constructor(player) {
        super()
        this.player = player
        this.hud = new CastHudSprite(this.player)
    }

    attack(){
        if(!this.player.spell || this.player.spell.is_cd) return

        this.player.spell.is_cd = true
        socket.emit('start_attack')
        this.hud.setAttack()
    }

    special(){
        if(!this.player.spell) return

        if(this.player.spell.is_cd) return

        this.player.spell.is_cd = true
        socket.emit('start_special')
        this.hud.setAttack()
    }

    specialAct(inputs){
        if(this.hud.isCastFrame() && this.player.spell.is_cd){
            this.player.specialCast()
        }
        if(this.hud.isAnimationEnd()){
            this.endSpecialCast()
        }
    }

    attackAct(inputs){
        if(this.hud.isCastFrame()){
            this.player.cast()
        }
        if(this.hud.isAnimationEnd()){
            this.endCast()
        }
    }

    getMode(){
        return CastMode.GAME_MODE_CAST
    }
}