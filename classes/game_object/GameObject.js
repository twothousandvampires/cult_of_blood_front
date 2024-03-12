export default class GameObject{

    constructor(x, y, id) {
        this.x = x
        this.y = y
        this.id = id
    }

    getAplha(distance, player){
        if(distance < player.min_distance){
            return 1
        }
        let relate_min_distance = distance - player.min_distance
        let dif = player.max_distance - player.min_distance
        let p = relate_min_distance/dif
        return 1 - p
    }
    act(){

    }
}