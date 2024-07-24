export default class CastMode{
    static GAME_MODE_CAST = 2
    endCast(){
        this.hud.setIdle()
        this.player.endCast()
        this.player.is_attack = false
    }

    endSpecialCast(){
        this.hud.setIdle()
        this.player.endSpecialCast()
        this.player.is_special = false
    }

    reset(){

    }
    act(inputs){
        this.hud.act()

        if(this.player.is_attack){
            this.attackAct(inputs)
        }
        else if(this.player.is_special){
            this.specialAct(inputs)
        }
    }
}