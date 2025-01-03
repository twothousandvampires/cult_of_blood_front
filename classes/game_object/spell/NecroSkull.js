import RotateObject from "../RotateObject.js";

export default class NecroSkull extends RotateObject{
    constructor(x, y, angle, id, texture_id) {
        super(x, y, id, texture_id, angle);
        this.box_x = 40
    }
}