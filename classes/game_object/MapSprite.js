import GameObject from "./GameObject.js";
import Render from "../Render.js";
import LocalMath from "../LocalMath.js";

export default class MapSprite extends GameObject{
    constructor(x, y, id, texture_id) {
        super(x, y, id);
        this.sprite = Render.getSpriteById(texture_id).state_sprite_data[0]
        this.box_x = this.sprite.box_x
        this.box_y = this.sprite.box_y
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

        let start_draw_x = Math.floor(sprite_angle * projection.width / player.fov);

        let wall_height = Math.floor(projection.halfHeight / distance);

        let sprite_width = Math.floor(this.box_x / distance);

        let sprite_height = this.box_y ? Math.floor(this.box_y / distance) : sprite_width

        let start_draw_y= projection.halfHeight + wall_height - sprite_height

        ctx.globalAlpha = this.getAplha(distance, player)
        ctx.drawImage(this.sprite.img,
            0,
            0,
            this.sprite.width,
            this.sprite.height,
            start_draw_x,
            start_draw_y,
            sprite_width,
            sprite_height
        )
        ctx.globalAlpha = 1
    }
}