export default class TransformHudSprite{
    constructor(player) {
        this.player = player
        this.frame_timer = 0
        this.frame = 0
        this.max_frame_timer = 11
        this.y_offset = 0
        this.img = new Image()
        this.img.src = 'transform_hud.png'
        this.max_frame = 10
    }

    isAnimationEnd(){
        return this.is_loop_end
    }

    act(){
        this.frame_timer++
        this.is_loop_end = false

        if(this.frame_timer >= this.max_frame_timer){
            this.frame ++
            this.frame_timer = 0

            if(this.frame > this.max_frame){
                this.is_loop_end = true
                this.frame = this.max_frame
            }
        }
    }
}