import StaffHudSprite from "../HudSprite/StaffHudSprite.js"
import socket from "../../socket.js";
import WeaponMode from "./WeaponMode.js";
import Input from "../Input.js";

export default class WeaponModeStaff extends WeaponMode{

    constructor(player) {
        super()
        this.player = player
        this.hud = new StaffHudSprite(this.player)
    }

    special(){
        if(this.player.is_special || this.player.is_attack) return

        socket.emit('start_special')
        this.hud.setSpecial()
    }

    attackAct(){
        if(this.player.is_attack){
            if(this.hud.isFrameHit() && !this.player.deal_hit){
                this.player.playerHit()
            }
            if(this.hud.isAnimationEnd()){
                this.hud.setIdle()
                this.player.endAttack()
            }
        }
    }
    specialAct(inputs){
        if(!inputs.is(Input.MOUSE_2)){
            this.is_special = false
            socket.emit('end_special')
            this.hud.setIdle()
        }
    }
    act(inputs){
        this.hud.act()

        if(this.player.is_attack){
            this.attackAct(inputs)
        }
        else if(this.player.is_special){
            this.specialAct(inputs)
        }
    }
    attack(){
        if(this.player.is_special || this.player.is_attack) return

        this.hud.setAttack()
        socket.emit('start_attack')
    }
}