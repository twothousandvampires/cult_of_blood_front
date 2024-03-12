import GameObject from "./GameObject.js";
import Render from "../Render.js";
import LocalMath from "../LocalMath.js";

export default class RotateObject extends GameObject{
    constructor(x, y, id, texture_id, angle = undefined) {
        super(x, y, id);
        this.sprite = Render.getSpriteById(texture_id).state_sprite_data[0]
        this.angle = angle
    }
    draw(player,ctx, buffer, projection) {
        let distance = Math.sqrt(Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2));
        if(distance > player.max_distance) return

        let sprite_x_relative = this.x - player.x;
        let sprite_y_relative = this.y - player.y;

        let sprite_angle_radians = LocalMath.radiansToDegrees(Math.atan2(sprite_y_relative, sprite_x_relative));
        let sprite_angle = sprite_angle_radians - Math.floor(player.angle - player.halfFov);

        if (sprite_angle > 360) sprite_angle -= 360;
        if (sprite_angle < 0) sprite_angle += 360;

        let sprite_x = Math.floor(sprite_angle * projection.width / player.fov);

        let sprite_width = Math.floor(this.box_x / distance);
        let sprite_height = sprite_width

        let start_draw = Math.round(sprite_x - sprite_width / 2)
        let offset = 0

        sprite_angle_radians = (sprite_angle_radians + 360) % 360

        if(sprite_angle_radians){
            let angle_dif = sprite_angle_radians - this.angle
            angle_dif = (angle_dif + 360) % 360
            if(angle_dif < 157.5 && angle_dif > 112.5){
                offset = 7
            }
            else if(angle_dif < 112.5 && angle_dif > 67.5){
                offset = 6
            }
            else if(angle_dif < 67.5 && angle_dif > 22.5){
                offset = 5
            }
            else if(angle_dif > 202.5 && angle_dif < 247.5){
                offset = 1
            }
            else if(angle_dif > 247.5 && angle_dif < 292.5){
                offset = 2
            }
            else if(angle_dif > 292.5 && angle_dif <  337.5){
                offset = 3
            }
            else if((angle_dif > 337.5 && angle_dif < 360) || (angle_dif > 0 && angle_dif < 22.5)){
                offset = 4
            }
        }

        ctx.globalAlpha = this.getAplha(distance, player)
        ctx.drawImage(this.sprite.img,
            this.sprite.width * offset,
            0,
            this.sprite.width,
            this.sprite.height,
            start_draw,
            projection.halfHeight - sprite_height / 2,
            sprite_width,
            sprite_height
        )
        ctx.globalAlpha = 1
    }
}