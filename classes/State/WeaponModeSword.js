import SwordHudSprite from "../HudSprite/SwordHudSprite.js";
import socket from "../../socket.js";
import WeaponMode from "./WeaponMode.js";
import Input from "../Input.js";

export default class WeaponModeSword extends WeaponMode{

    constructor(player) {
        super()
        this.player = player
        this.hud = new SwordHudSprite(this.player)
        this.attack_range = 0.8
        this.attack_cooldown = 200
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
                setTimeout(()=> {
                    this.is_attack_cooldown = false
                }, this.attack_cooldown)
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
}