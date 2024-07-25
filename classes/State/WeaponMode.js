import socket from "../../socket.js";

export default class WeaponMode{
    constructor() {
        this.is_attack_cooldown = false
    }
    static WEAPON_SWORD = 1
    static WEAPON_STAFF = 2
    static GAME_MODE_WEAPON = 1


    getMode(){
        return WeaponMode.GAME_MODE_WEAPON
    }

    attack(){

        if(this.player.is_special || this.player.is_attack || this.is_attack_cooldown) return

        this.is_attack_cooldown = true
        this.hud.setAttack()
        socket.emit('start_attack')
    }
}