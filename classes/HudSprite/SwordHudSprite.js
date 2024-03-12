export default class SwordHudSprite{
    constructor(player) {
        this.player = player
        this.frame_timer = 0
        this.frame = 0
        this.max_frame_timer = 7
        this.y_offset = 0
        this.max_frame = 0
        this.img = new Image()
        this.img.src = 'hud2.png'
    }
    isFrameHit(){
        return this.frame === 5
    }
    isAnimationEnd(){
        return this.is_loop_end
    }

    setAttack(){
        this.y_offset = 0
        this.max_frame = 8
    }

    setSpecial(){
        this.y_offset = 200
        this.max_frame = 0
    }

    setIdle(){
        this.y_offset = 0
        this.max_frame = 0
    }

    act(){
        this.frame_timer++
        this.is_loop_end = false

        if(this.frame_timer >= this.max_frame_timer){
            this.frame ++
            this.frame_timer = 0

            if(this.frame > this.max_frame){
                this.is_loop_end = true
                this.frame = 0
                this.frame_timer = 0
            }
        }
    }
}