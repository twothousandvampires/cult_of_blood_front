import Sprite from "./Sprite.js";
import LocalMath from "../LocalMath.js";
import Render from "../Render.js";

export default class PlayerSprite extends Sprite{
    constructor(x, y, angle, socket_id, nick, hp, texture_id, state) {
        super(x, y, angle, socket_id);
        this.nick = nick
        this.hp = hp
        this.texture_id = texture_id
        this.state = state
        this.frame = 0
        this.frame_timer = 0
        this.attack = false
        this.sprite = Render.getSpriteById(texture_id)
    }

    draw(player, ctx, buffer, projection){

        let img = this.sprite.state_sprite_data[this.state - 1];

        let spriteXRelative = this.x - player.x;
        let spriteYRelative = this.y - player.y;

        let spriteAngleRadians = LocalMath.radiansToDegrees(Math.atan2(spriteYRelative, spriteXRelative));
        let spriteAngle = spriteAngleRadians - Math.floor(player.angle - player.halfFov);

        if(spriteAngle > 360) spriteAngle -= 360;
        if(spriteAngle < 0) spriteAngle += 360;

        let spriteX = Math.floor(spriteAngle * projection.width / player.fov);

        let distance = Math.sqrt(Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2));

        let spriteWidth = Math.floor(img.width / distance);
        let spriteHeight = Math.floor(projection.height / distance);

        this.in_attack = projection.middle > spriteX - spriteWidth / 2 && projection.middle < spriteX + spriteWidth / 2

        let start_draw = Math.round(spriteX - spriteWidth / 2)
        let s_w = img.width
        let s_w_offset = 0
        let s_w_o = 0

        if((buffer[start_draw] < distance && buffer[start_draw + spriteWidth - 1] < distance)){
            return;
        }
        else if(buffer[start_draw] < distance){
            for(let i = start_draw; i < start_draw + spriteWidth; i++){
                if(buffer[i] > distance){
                    s_w_offset = s_w * ( (i - start_draw) / spriteWidth)
                    s_w_o = (i - start_draw)
                    s_w *= ( spriteWidth - (i - start_draw) )/ spriteWidth
                    spriteWidth -= (i - start_draw)
                    break
                }
            }
        }
        else if(buffer[start_draw + spriteWidth - 1] < distance){
            for(let i = start_draw; i < start_draw + spriteWidth; i++){
                if(buffer[i] < distance){
                    s_w *= (i - start_draw) / spriteWidth
                    spriteWidth -= spriteWidth - (i - start_draw)
                    break
                }
            }
        }

        let offset = 0
        spriteAngleRadians = (spriteAngleRadians + 360) % 360
        if(spriteAngleRadians){
            let angle_dif = spriteAngleRadians - this.angle
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
        if(this.state != this.previos_state){
            this.frame = 0
            this.frame_timer = 0
        }
        else {
            if(this.state == 1 && !this.attack){
                this.frame = 0
            }
            else if(this.state == 1 && this.attack){
                if(!(offset === 0 || offset === 1 || offset === 7)){
                    this.frame = 0
                }
                else {
                    this.frame_timer ++
                    if(this.frame_timer > 7){
                        this.frame_timer = 0
                        this.frame ++
                        if(this.frame > 5){
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
                    if(this.frame > 5){
                        this.frame = 0
                    }
                }
            }
        }
        let frame = this.frame

        if(this.attack){
            if(offset === 0 || offset === 1 || offset === 7){
                offset = 0
                img = this.sprite.state_sprite_data[2]
            }
            else {
                img = this.sprite.state_sprite_data[this.state - 1]
            }
        }

        ctx.fillText(this.nick + '(' + this.hp + ')' + (this.attack ? '!!!' : ''), spriteX - 10, projection.halfHeight - spriteHeight / 2)
        ctx.font = "12px serif";
        ctx.fillStyle = 'white'

        ctx.drawImage(img.img,
            img.width  * offset + s_w_offset,
            img.height * frame,
            s_w,
            img.height,
            start_draw + s_w_o,
            projection.halfHeight - spriteHeight / 2,
            spriteWidth,
            spriteHeight
        )
    }
}