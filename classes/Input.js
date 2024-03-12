export default class Input{
    static W_KEY_CODE = 87
    static S_KEY_CODE = 83
    static A_KEY_CODE = 65
    static D_KEY_CODE = 68
    static E_KEY_CODE = 69
    static F_KEY_CODE = 70
    static Q_KEY_CODE = 81
    static MOUSE_1 = 'mouse_1'
    static MOUSE_2 = 'mouse_2'
    constructor() {

        window.addEventListener('mousemove', (e) => {
            if (this.move) clearTimeout(this.move);
            this.move = setTimeout(() => {
                this.move = false
                this.move_x = 0
            }, 30);
            if(this.move){
                this.move_x = e.movementX
            }
        })
        window.addEventListener('keydown', (event) => {
            this[event.keyCode] = true
        })
        window.addEventListener('keyup', (event) => {
            this[event.keyCode] = false
        })
        window.addEventListener('mousedown', (event) =>{
            if(event.which == 1){
                this.mouse_1 = true
            }
            else if(event.which == 3){
                this.mouse_2 = true
            }
        })
        window.addEventListener('mouseup', (event) =>{
            if(event.which == 1){
                this.mouse_1 = false
            }
            else if(event.which == 3){
                this.mouse_2 = false
            }
        })
    }

    is(code){
        return this[code]
    }
}