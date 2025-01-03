import TransformHudSprite from "../HudSprite/TransformHudSprite.js"
import WeaponMode from "./WeaponMode.js";

export default class TransformMode extends WeaponMode{

    constructor(player) {
        super()
        this.player = player
        this.hud = new TransformHudSprite(this.player)
    }

    act(inputs){
        this.hud.act()
    }
}