import CastMode from "./CastMode.js";
import CastHudSprite from "../HudSprite/CastHudSprite.js";
import socket from "../../socket.js";
import Input from "../Input.js";

export default class CastModeChanneling extends CastMode{
    constructor(player) {
        super()
        this.player = player
        this.hud = new CastHudSprite(this.player)
        this.alredy_channel = false
        this.was_interapted = false
    }

    attack(){
        if(!this.player.spell) return
        if(this.alredy_channel) return;

        this.alredy_channel = true
        socket.emit('start_attack')
        this.hud.setAttack()
    }

    special(){
        if(!this.player.spell) return
        if(this.alredy_channel) return;

        this.alredy_channel = true
        socket.emit('start_special')
        this.hud.setSpecial()
    }

    specialAct(inputs){
        if(!inputs.is(Input.MOUSE_2) && !this.was_interapted){
            this.was_interapted = true
        }
        else if(this.hud.isCastFrame() && !this.was_interapted){
            this.player.specialCast()
            this.hud.stopFrame()
            return
        }
        if(this.hud.isAnimationEnd()){
            this.was_interapted = false
            this.alredy_channel = false
            this.endSpecialCast()
        }
    }

    attackAct(inputs){
        if(!inputs.is(Input.MOUSE_1) && !this.was_interapted){
            this.was_interapted = true
        }
        else if(this.hud.isCastFrame() && !this.was_interapted){
            this.player.cast()
            this.hud.stopFrame()
            return
        }
        if(this.hud.isAnimationEnd()){
            this.was_interapted = false
            this.alredy_channel = false
            this.endCast()
        }
    }
}