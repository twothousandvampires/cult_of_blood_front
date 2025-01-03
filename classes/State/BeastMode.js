import BeastHudSprite from "../HudSprite/BeastHudSprite.js"
import socket from "../../socket.js";
import WeaponMode from "./WeaponMode.js";
import Input from "../Input.js";

export default class BeastMode extends WeaponMode{

    constructor(player) {
        super()
        this.player = player
        this.hud = new BeastHudSprite(this.player)
        this.attack_range = 1.4
        this.attack_cooldown = 800
        this.was_interapted = false
        this.special_cd = false
    }

    special(){
        if(this.player.is_special || this.player.is_attack || this.special_start) return
        this.special_start = true
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
        if(this.hud.isSpecialHit() && !this.player.is_special && !this.special_cd){
            this.special_cd = true
            socket.emit('start_special')
            this.hud.stopFrame()
            setTimeout(()=> {
                this.hud.stopped = false
                socket.emit('end_special')
            }, 1000)
        }
        if(this.hud.isAnimationEnd()){
            this.hud.setIdle()
            this.special_cd = false
            this.special_start = false
        }
    }
    act(inputs){
        this.hud.act()

        if(this.player.is_attack){
            this.attackAct(inputs)
        }
        else if(this.special_start){
            this.specialAct(inputs)
        }
    }

}