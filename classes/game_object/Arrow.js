import RotateObject from "./RotateObject.js";

export default class Arrow extends RotateObject{
    constructor(x, y, angle, id, texture_id) {
        super(x, y, id, texture_id, angle,);
        this.simple = true
        this.box_x = 25
    }
}