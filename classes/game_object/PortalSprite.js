import LocalMath from "../LocalMath.js";
import GameObject from "./GameObject.js";
import Render from "../Render.js";

export default class PortalSprite extends GameObject{
    constructor(sprite) {
        super(sprite.x, sprite.y, Math.random() + '');
        this.sprite = Render.getSpriteById(sprite.name).state_sprite_data[0]
        this.is_active = sprite.active
        this.index = sprite.index
        this.box_x = this.sprite.box_x
        this.box_y = this.sprite.box_y
    }

    draw(player, ctx, buffer, projection) {

        let distance = Math.sqrt(Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2));
        if(distance > player.max_distance) return

        let img = this.sprite

        let sprite_x_relative = this.x - player.x;
        let sprite_y_relative = this.y - player.y;

        let sprite_angle_radians = LocalMath.radiansToDegrees(Math.atan2(sprite_y_relative, sprite_x_relative));
        let sprite_angle = sprite_angle_radians - Math.floor(player.angle - player.halfFov);

        if(sprite_angle > 360) sprite_angle -= 360;
        if(sprite_angle < 0) sprite_angle += 360;

        let sprite_x = Math.floor(sprite_angle * projection.width / player.fov);

        let sprite_width = Math.floor(img.box_x / distance);
        let sprite_height = Math.floor(img.box_y / distance);

        let wall_height = Math.floor(projection.halfHeight / distance);

        let start_draw = Math.round(sprite_x - sprite_height / 2)
        let s_w = img.width
        let s_w_offset = 0
        let s_w_o = 0

        if((buffer[start_draw] < distance && buffer[start_draw + sprite_width - 1] < distance)){
            return;
        }
        else if(buffer[start_draw] < distance){
            for(let i = start_draw; i < start_draw + sprite_width; i++){
                if(buffer[i] > distance){
                    s_w_offset = s_w * ( (i - start_draw) / sprite_width)
                    s_w_o = (i - start_draw)
                    s_w *= ( sprite_width - (i - start_draw) )/ sprite_width
                    sprite_width -= (i - start_draw)
                    break
                }
            }
        }
        else if(buffer[start_draw + sprite_width - 1] < distance){
            for(let i = start_draw; i < start_draw + sprite_width; i++){
                if(buffer[i] < distance){
                    s_w *= (i - start_draw) / sprite_width
                    sprite_width -= sprite_width - (i - start_draw)
                    break
                }
            }
        }

        ctx.globalAlpha = this.getAplha(distance, player)
        ctx.drawImage(
            img.img,
            s_w_offset + (this.is_active ? 50 : 0),
            0,
            s_w,
            img.height,
            start_draw + s_w_o,
            projection.halfHeight + wall_height - sprite_height,
            sprite_width,
            sprite_height
        )
        ctx.globalAlpha = 1
    }
}