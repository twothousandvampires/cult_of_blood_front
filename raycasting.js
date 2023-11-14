import Game from "./classes/Game.js";
window.onload = function() {
    const game = new Game()
    game.prepare()
    game.initSocketAndInput()
    game.startLoop()
}