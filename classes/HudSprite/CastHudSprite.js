export default class CastHudSprite{
    constructor(player) {
        this.player = player
        this.frame_timer = 0
        this.frame = 0
        this.max_frame_timer = 7
        this.max_frame = 0
        this.y_offset = 0
        this.img = new Image()
        this.img.src = 'left.png'
    }

    isCastFrame(){
        return this.frame === 5
    }
    isAnimationEnd(){
        return this.is_loop_end
    }
    setSpecial(){
        this.frame = 0
        this.max_frame = 9
        this.y_offset = 200
    }

    setAttack(){
        this.y_offset = 0
        this.frame = 0
        this.max_frame = 9
    }

    setIdle(){
        this.frame = 0
        this.max_frame = 0
    }
    stopFrame(){
        this.frame_timer = 0
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