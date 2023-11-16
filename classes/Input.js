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
            e: {
                pressed: false
            },
            q: {
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
                    this.keys.e.pressed = true
                    break
                case 'KeyQ':
                    this.keys.q.pressed = true
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
                case 'KeyE':
                    this.keys.e.pressed = false
                    break
                case 'KeyQ':
                    this.keys.q.pressed = false
                    break
            }

        })
        window.addEventListener('mousedown', (event) =>{
            this.keys.mouse_1.pressed = true
        })
        window.addEventListener('mouseup', (event) =>{
            this.keys.mouse_1.pressed = false
        })
    }
    get(){
        return this.keys
    }
}