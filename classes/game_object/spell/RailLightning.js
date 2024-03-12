import SimpleObject from "../SimpleObject.js";

export default class RailLightning extends SimpleObject{
    constructor(x, y, angle, id, texture_id) {
        super(x, y, id, texture_id, angle)
        this.box_x = 20
        this.tick = 0
    }

    act(game){
        this.tick++
        if(this.tick%2 === 0){
            this.tick = 0
            this.box_x -= 1
            if(this.box_x <= 0){
                game.sprites = game.sprites.filter(elem => elem != this)
            }
        }
    }
}