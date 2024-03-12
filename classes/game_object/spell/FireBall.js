import SimpleObject from "../SimpleObject.js";

export default class FireBall extends SimpleObject{
    constructor(x, y, angle, id, texture_id) {
        super(x, y, id, texture_id, angle)
        this.default_box_x = 10
        this.box_x = this.default_box_x
    }

    act(game){
        if(!this.stage) return

        this.box_x = this.default_box_x + this.stage * 20
    }
}