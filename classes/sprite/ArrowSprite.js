import Sprite from "./Sprite.js";
import LocalMath from "../LocalMath.js";
import Render from "../Render.js";

export default class ArrowSprite extends Sprite{
    constructor(x, y, angle, id, texture_id) {
        super(x, y, angle, id);
        this.texture_id = 'arrow'
        this.state = 1
        this.simple = true
        this.sprite = Render.getSpriteById(texture_id)
    }

    draw(player,ctx, buffer, projection) {
        let img = this.sprite.state_sprite_data[0]
        let spriteXRelative = this.x - player.x;
        let spriteYRelative = this.y - player.y;

        let spriteAngleRadians = LocalMath.radiansToDegrees(Math.atan2(spriteYRelative, spriteXRelative));
        let spriteAngle = spriteAngleRadians - Math.floor(player.angle - player.halfFov);

        if (spriteAngle > 360) spriteAngle -= 360;
        if (spriteAngle < 0) spriteAngle += 360;

        let spriteX = Math.floor(spriteAngle * projection.width / player.fov);

        let distance = Math.sqrt(Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2));

        let spriteWidth = Math.floor(img.width / distance);
        let spriteHeight = spriteWidth

        let start_draw = Math.round(spriteX - spriteWidth / 2)
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
        console.log(offset)
        ctx.drawImage(img.img,
            img.width * offset,
            0,
            img.width,
            img.height,
            start_draw,
            projection.halfHeight - spriteHeight / 2,
            spriteWidth,
            spriteHeight
        )
    }
}