import LightningBolt from "../game_object/spell/LightningBolt.js";
import DarkSkull from "../game_object/spell/DarkSkull.js";
import RailLightning from "../game_object/spell/RailLightning.js";
import BigDarkSkull from "../game_object/spell/BigDarkSkull.js";
import IceShard from "../game_object/spell/IceShard.js";
import FireBall from "../game_object/spell/FireBall.js";

export default class SpellSpriteCreator{
    static create(x, y, angle, id, texture_id){
        switch (texture_id){
            case 'ball_lightning':
                return new LightningBolt(x, y, angle, id, texture_id)
            case 'dark_skull':
                return new DarkSkull(x, y, angle, id, texture_id)
            case 'big_dark_skull':
                return new BigDarkSkull(x, y, angle, id, texture_id)
            case 'rail_lightning':
                return new RailLightning(x, y, angle, id, texture_id)
            case 'ice_shard':
                return new IceShard(x, y, angle, id, texture_id)
            case 'fireball':
                return new FireBall(x, y, angle, id, texture_id)
        }
    }
}