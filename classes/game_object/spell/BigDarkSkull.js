import SimpleObject from "../SimpleObject.js";

export default class BigDarkSkull extends SimpleObject{
    constructor(x, y, angle, id, texture_id) {
        super(x, y, id, texture_id, angle)
        this.box_x = 90
    }
}