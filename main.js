import Game from "./classes/Game.js";
let start_btn = document.getElementById('start-btn')
start_btn.addEventListener('click', function (){
    let start_btn = document.getElementById('start-btn-wrap')
    start_btn.remove()

    const game = new Game()
    game.prepare()
    game.initSocketAndInput()
    game.getRole()
})