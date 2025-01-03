import DaggerHudSprite from "../HudSprite/DaggerHudSprite.js";
import socket from "../../socket.js";
import WeaponMode from "./WeaponMode.js";
import Input from "../Input.js";

export default class WeaponModeDagger extends WeaponMode{

    constructor(player) {
        super()
        this.player = player
        this.hud = new DaggerHudSprite(this.player)
        this.attack_range = 0.6
        this.attack_cooldown = 1000
        this.was_interapted = false
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
        if(this.hud.isAnimationEnd()){
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