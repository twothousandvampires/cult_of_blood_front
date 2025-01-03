export default class DaggerHudSprite{
    constructor(player) {
        this.player = player
        this.frame_timer = 0
        this.frame = 0
        this.max_frame_timer = 7
        this.y_offset = 0
        this.max_frame = 0
        this.img = new Image()
        this.img.src = 'hud_dagger.png'
    }
    isFrameHit(){
        return this.frame === 6
    }
    isAnimationEnd(){
        return this.is_loop_end
    }

    setAttack(){
        this.y_offset = 0
        this.max_frame = 9
    }

    setSpecial(){
        this.y_offset = 200
        this.max_frame = 9
    }

    setIdle(){
        this.y_offset = 0
        this.max_frame = 0
        this.min_frame = 0
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