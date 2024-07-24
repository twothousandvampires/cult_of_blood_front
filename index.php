<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
</head>
<body>
    <?php
        class Test{
            public function testF(){
                return '111';
            }
        }

        class User{
            public function get(Test $test){
                echo $test->testF();
            }
        }

        $u = new User();

        function build($className)
        {
            $reflector = new ReflectionClass($className);
            $constructor = $reflector->getConstructor();

            $instances = [];

            if($constructor){
                foreach ($constructor->getParameters() as $dependency) {
                    $instances[] = build($dependency->getClass()->name);
                }
            }


            return $reflector->newInstanceArgs($instances);
        }

        function dispatchClassMethodWithDI($class, $method){

            $r_method = new ReflectionMethod($class, $method);
            $methodParams = $r_method->getParameters();
            $callParams = [];

            foreach ($methodParams as $parameter) {

                $r_class = $parameter->getClass();

                if ($r_class !== null) {
                    $instance = build($r_class->name);
                    $callParams[] = $instance;
                }
            }

            $classReflect = build($class);

            $classReflect->{$method}(...$callParams);
        }

//        dispatchClassMethodWithDI(User::class, 'get');

    ?>
    <div id="img-data" style="display: none">
        <img id="texture" src="texture.png">
        <img id="graveyard-fence" src="graveyard_fence.png">
        <img id="background" src="background.png">
        <img id="tree" src="skeleton.png">
        <img id="floor-texture" src="floor.png">
    </div>
    <div id="game" style="display: none">
        <div id="minimap-wrap">
            <p style="text-align: center;padding: 0;margin: 0;color:white" id="minimap-name"></p>
            <div id="minimap-content">

            </div>
        </div>
        <div id="leaderboard">
            <div id="leaderboard_content" style="color: white">

            </div>
            <div id="spell">

            </div>
        </div>
        <div style="display: none" id="dead_modal">
            <div style="width: 300px">
                <p id="dead_text">YOU ARE DEAD</p>
                <img style="width: 100%; height: 100%" src="sprites/game/Spell_Destroy_Undead.gif" alt="">
                <p id="go_next"></p>
            </div>
        </div>
        <div id="canvas_wrap">
            <div id="player_hud">
                <div class="player_hud_block">
                    <img src="sprites/game/Spell_First_Aid.gif" alt="">
                    <p class="hud_stat_value" id="player_hud_hp"></p>
                </div>
                <div  class="player_hud_block">
                    <img src="sprites/game/Spell_Mind_Blast.gif" alt="">
                    <p class="hud_stat_value" id="player_hud_armour"></p>
                </div>
                <div  class="player_hud_block">
                    <img src="sprites/game/Spell_Power.gif" alt="">
                    <p class="hud_stat_value" id="player_hud_power"></p>
                </div>
                <div  class="player_hud_block">
                    <img src="sprites/game/Spell_Flame_Arrow.gif" alt="">
                    <p class="hud_stat_value" id="player_hud_ammo"></p>
                </div>
                <div  class="player_hud_block">
                    <img src="sprites/game/Spell_Haste.gif" alt="">
                    <p class="hud_stat_value" id="player_hud_speed"></p>
                </div>
            </div>
        </div>
        <div id="log">

        </div>
    </div>
    <div id="pre-game">
        <audio id="main-audio" src="/main.mp3"></audio>
        <div id="start-btn-wrap">
            <img style="visibility: hidden" src="skull.gif">
            <p id="start-btn">start</p>
            <img style="visibility: hidden" src="skull.gif">
        </div>
        <div id="nick_input">
            <div>
                <input placeholder="nickname" autocomplete="off" id="nick" type="text">
            </div>
            <div style="display: flex;flex-direction: column;align-items: center;justify-content: center">
                <select name="weapon" id="weapon">
                    <option value="1" selected>sword</option>
                    <option value="2" >staff</option>
                </select>
                <select id="skin">
                    <option data-img="/sprite_preview/titan.png" value="titan">titan</option>
                    <option data-img="/sprite_preview/skeleton.png" value="skeleton">skeleton</option>
                    <option data-img="/sprite_preview/druid.png" value="druid">druid</option>
                </select>
                <img id="preview-img" width="140px" height="200px" src="/sprite_preview/titan.png">
                <script>
                    let select = document.getElementById('skin')
                    select.addEventListener('change', (e)=> {
                        let o = select.querySelectorAll('option')
                        o.forEach(elem => {
                            if(elem.selected){
                                let img = document.getElementById('preview-img')
                                img.src = elem.dataset.img
                            }
                        })
                    })
                </script>
            </div>
            </div>
        </div>
    </div>
</body>
<script>
    window.addEventListener('mousemove', ()=>{
        // let a = document.getElementById('main-audio')
        // a.play()
    })
    window.onload = function() {
        let start_btn = document.getElementById('start-btn-wrap')
        start_btn.style.display = 'flex'
    }
    let start_btn = document.getElementById('start-btn')
    start_btn.addEventListener('mouseenter', ()=>{
        let p = start_btn.parentElement
        let i = p.querySelectorAll('img')
        i.forEach(elem => {
            elem.style.visibility = 'visible'
        })
    })
    start_btn.addEventListener('mouseleave', ()=>{
        let p = start_btn.parentElement
        let i = p.querySelectorAll('img')
        i.forEach(elem => {
            elem.style.visibility = 'hidden'
        })
    })
</script>
<script type="module" src="main.js"></script>
</html>
<style>
    #game{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background-color: black;
        height: 100vh;
        overflow: hidden;
    }
    #start-btn-wrap{
        position: absolute;
        top:70%;
        left:calc(50% - 100px);
        color: wheat;
        width: 200px;
        text-align: center;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    #start-btn{
        font-size: 40px;
        color: red;
        cursor: pointer;
        transition: font-size ease-in 0.3s;
    }
    #start-btn:hover{
        font-size: 50px;
    }
    #pre-game{
        background-image: url('/main.png');
        width: 100%;
        height: 100%;
        background-size: cover;
        background-repeat: no-repeat;
    }
    body{
        width: 100%;
        height: 100vh;
        margin: 0;
    }
    #dead_text{
        font-weight: bold;
        color: black;
        position: relative;
        font-size: 20px;
        top: 120px;
        left: 70px;
    }
    #go_next{
        cursor: pointer;
        font-weight: bold;
        color: black;
        position: relative;
        font-size: 20px;
        top: -110px;
        left: 120px;
    }
    #nick_input, #dead_modal{
        width: 400px;
        height: 300px;
        display: none;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        position: fixed;
        top:calc(50% - 150px);
        left:calc(50% - 200px);
        background-color: pink;
    }
    .modal{
        font-weight: bold;
        width: 100px;
        height: 100px;
        position: fixed;
        font-size: 36px;
        display: flex;
        flex-direction: row;
        text-align: center;
        justify-content: center;
    }
    #player_hud{
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        position: absolute;
    }
    .player_hud_block{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .hud_stat_value{
        color: azure;
        font-size: 36px;
    }
     #leaderboard, #log{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
         border: 4px gray solid;
     }
     #leaderboard{
         display: flex;
         flex-direction: column;
         justify-content: space-between;
     }
     #log{
         color: white;
         align-items: center;
     }
     #log p{
         margin: 0;
     }
     #spell{
         padding: 6px;
         text-align: center;
     }
     #leaderboard_content{
         padding: 6px;
         text-align: center;
     }
     #minimap-content{
         display: flex;
         flex-direction: column;
     }
     #minimap-wrap{
         position: fixed;
         width: 200px;
         height: 140px;
         top:calc(100% - 150px);
         left:calc(50% - 100px);
     }
     .minimap-row{
         display: flex;
         flex-direction: row;
     }
     .minimap-cell{
         width: 10px;
         height: 10px;
     }
</style>