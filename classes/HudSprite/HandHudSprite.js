export default class HandHudSprite{
    constructor(player) {
        this.player = player
        this.frame_timer = 0
        this.frame = 0
        this.max_frame_timer = 7
        this.y_offset = 200
        this.max_frame = 0
        this.img = new Image()
        this.img.src = 'hud_necro.png'
    }
    isFrameHit(){
        return this.frame === 6
    }
    isAnimationEnd(){
        return this.is_loop_end
    }

    setAttack(){
        if(this.corpse){
            this.y_offset = 400
        }else {
            this.y_offset = 200
        }
        this.max_frame = 8
        this.max_frame_timer = 7
    }

    setSpecial(){
        if(this.corpse){
            this.y_offset = 600
        }
        else {
            this.y_offset = 0
        }
        this.max_frame = 10
        this.max_frame_timer = 14
    }

    setIdle(){
        if(this.corpse){
            this.y_offset = 400
        }
        else {
            this.y_offset = 200
        }
        this.max_frame = 0
        this.min_frame = 0
        this.max_frame_timer = 7
    }

    stopFrame(){
        this.min_frame = 1
    }

    isCastFrame(){
        return this.frame === 5
    }

    act(){
        this.frame_timer++
        this.is_loop_end = false

        if(this.frame_timer >= this.max_frame_timer){
            this.frame ++
            this.frame_timer = 0

            if(this.frame > this.max_frame){
                this.is_loop_end = true
                if(this.min_frame){
                    this.frame = this.min_frame
                }
                else {
                    this.frame = 0
                }

                this.frame_timer = 0
            }
        }
    }
}