import LocalMath from "../LocalMath.js";
import Render from "../Render.js";
import GameObject from "./GameObject.js";

export default class Player extends GameObject{
    constructor(x, y, angle, socket_id, nick, hp, texture_id, state) {
        super(x, y, socket_id);
        this.nick = nick
        this.angle = angle
        this.hp = hp
        this.texture_id = texture_id
        this.state = state
        this.frame = 0
        this.frame_timer = 0
        this.is_attack = false
        this.sprite = Render.getSpriteById(texture_id)
    }
    setNewTexture(texture_id){
        this.texture_id = texture_id
        this.sprite = Render.getSpriteById(texture_id)
    }
    draw(player, ctx, buffer, projection){
        if(this.is_invisible) return

        let distance = Math.sqrt(Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2));
        if(distance > player.max_distance) return

        let img = this.sprite.state_sprite_data[this.state - 1];

        let sprite_x_relative = this.x - player.x;
        let sprite_y_relative = this.y - player.y;

        let sprite_angle_radians = LocalMath.radiansToDegrees(Math.atan2(sprite_y_relative, sprite_x_relative));
        let sprite_angle = sprite_angle_radians - Math.floor(player.angle - player.halfFov);

        if(sprite_angle > 360) sprite_angle -= 360;
        if(sprite_angle < 0) sprite_angle += 360;

        let sprite_x = Math.floor(sprite_angle * projection.width / player.fov);

        let sprite_width = Math.floor(img.game_width / distance);
        let sprite_height = Math.floor(img.game_height / distance);

        let wall_height = Math.floor(projection.halfHeight / distance);
        this.in_attack = projection.middle > sprite_x - sprite_width / 2 && projection.middle < sprite_x + sprite_width / 2

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

        if(this.state === 4){
            offset = 0
        }
        if(this.state != this.previos_state){
            this.frame = 0
            this.frame_timer = 0
        }
        else {
            if(this.state == 1 && !this.is_attack){
                this.frame = 0
            }
            else if(this.state == 1 && this.is_attack){
                if(!(offset === 0 || offset === 1 || offset === 7)){
                    this.frame = 0
                }
                else {
                    this.frame_timer ++
                    if(this.frame_timer > 7){
                        this.frame_timer = 0
                        this.frame ++
                        if(this.frame > this.sprite.sprite_data.max_attack_frame){
                            this.frame = 0
                        }
                    }
                }
            }
            else {
                this.frame_timer ++
                if(this.frame_timer > 7){
                    this.frame_timer = 0
                    this.frame ++

                    if(this.state != 4){
                        if(this.frame > this.sprite.sprite_data.max_walk_frame){
                            this.frame = 0
                        }
                    }
                    else {
                        if(this.frame > this.sprite.sprite_data.max_dead_frame){
                            this.frame = this.sprite.sprite_data.max_dead_frame
                        }
                    }
                }
            }
        }
        let frame = this.frame
        if(this.is_attack){
            if(offset === 0 || offset === 1 || offset === 7){
                offset = 0
                img = this.sprite.state_sprite_data[2]
            }
            else {
                img = this.sprite.state_sprite_data[this.state - 1]
            }
        }

        ctx.globalAlpha = this.getAplha(distance, player)
        ctx.drawImage(img.img,
            img.width  * offset + s_w_offset,
            img.height * frame,
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