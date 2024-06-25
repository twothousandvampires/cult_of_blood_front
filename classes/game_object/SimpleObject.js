import GameObject from "./GameObject.js";
import LocalMath from "../LocalMath.js";
import Render from "../Render.js";

export default class SimpleObject extends GameObject{
    constructor(x, y, id, texture_id, angle = undefined) {
        super(x, y, id);
        this.sprite = Render.getSpriteById(texture_id).state_sprite_data[0]
        this.angle = angle
    }

    draw(player, ctx, buffer, projection) {
        let distance = LocalMath.distance(player, this)
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

        ctx.globalAlpha = this.getAplha(distance, player)
        ctx.drawImage(this.sprite.img,
            0,
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