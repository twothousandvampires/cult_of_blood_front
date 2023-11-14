export default class Input{
    constructor() {
        this.keys = {
            w: {
                pressed: false
            },
            a: {
                pressed: false
            },
            s: {
                pressed: false
            },
            d: {
                pressed: false
            },
            mouse_1: {
                pressed: false
            }
        }
        window.addEventListener('keydown', (event) => {

            switch (event.code) {
                case 'KeyW':
                    this.keys.w.pressed = true
                    break

                case 'KeyA':
                    this.keys.a.pressed = true
                    break

                case 'KeyS':
                    this.keys.s.pressed = true
                    break
                case 'KeyD':
                    this.keys.d.pressed = true
                    break
                case 'KeyE':
                    socket.emit('arrow_shot')
                    break
            }
        })
        window.addEventListener('keyup', (event) => {

            switch (event.code) {
                case 'KeyW':
                    this.keys.w.pressed = false
                    break

                case 'KeyA':
                    this.keys.a.pressed = false
                    break

                case 'KeyS':
                    this.keys.s.pressed = false
                    break

                case 'KeyD':
                    this.keys.d.pressed = false
                    break
            }

        })
        window.addEventListener('mousedown', (event) =>{
            this.keys.mouse_1.pressed = true
        })
    }
    get(){
        return this.keys
    }
}