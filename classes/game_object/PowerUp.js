import Render from "../Render.js";
import LocalMath from "../LocalMath.js";
import GameObject from "./GameObject.js";

export default class PowerUp extends GameObject{
    constructor(x, y, id, texture_id) {
        super(x, y, id);
        this.sprite = Render.getSpriteById(texture_id).state_sprite_data[0]
        this.wobble = 0
        this.wobble_tick = 0
        this.wobble_dir = 1
    }

    draw(player,ctx, buffer, projection) {
        let distance = Math.sqrt(Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2));
        if(distance > player.max_distance) return

        this.wobble_tick ++
        if(this.wobble_tick > 4){
            this.wobble += this.wobble_dir
            this.wobble_tick = 0
            if(this.wobble > 2 || this.wobble < -2){
                this.wobble_dir *= -1
            }
        }

        let sprite_x_relative = this.x - player.x;
        let sprite_y_relative = this.y - player.y;

        let sprite_angle_radians = LocalMath.radiansToDegrees(Math.atan2(sprite_y_relative, sprite_x_relative));
        let sprite_angle = sprite_angle_radians - Math.floor(player.angle - player.halfFov);

        if (sprite_angle > 360) sprite_angle -= 360;
        if (sprite_angle < 0) sprite_angle += 360;

        let spriteX = Math.floor(sprite_angle * projection.width / player.fov);

        let sprite_width = Math.floor(this.sprite.width / distance);
        let sprite_height = sprite_width

        let start_draw = Math.round(spriteX - sprite_width / 2)

        ctx.globalAlpha = this.getAplha(distance, player)
        ctx.drawImage(this.sprite.img,
            0,
            0,
            this.sprite.width,
            this.sprite.height,
            start_draw,
            projection.halfHeight - sprite_height / 2 + this.wobble,
            sprite_width,
            sprite_height
        )
        ctx.globalAlpha = 1
    }
}