const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
    },
    backgroundColor: '#4a4d6b',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let masoCartas = [];
let cartasSeleccionadas = [];
let primeraCarta = null;
let segundaCarta = null;
let puedeGirar = true;

function preload(){
    this.load.image('duda', 'public/assets/cards/duda.png');
    for(let i = 1; i <= 6; i++){
        for (let j = 1; j <= 2; j++) {
            this.load.image(`card${i}`, `public/assets/cards/card${i}.png`);
        }
    }
}
function create(){
    for(let j = 1; j <= 2; j++){
        for(let i = 1; i <= 6; i++){
            const carta = this.add.image(null, null,'duda')
            carta.setInteractive();
            carta.type = i;
            carta.estaVolteada = false;
            carta.setOrigin(0.5);
            masoCartas.push(carta);

            
            carta.on('pointerdown', ()=>{
                if(puedeGirar && !carta.estaVolteada){
                    carta.setTexture(`card${carta.type}`);
                    carta.estaVolteada = true;
                    if(!primeraCarta){
                        primeraCarta = carta;
                    }else if(!segundaCarta){
                        segundaCarta = carta;
                        puedeGirar = false;

                        this.time.addEvent({
                            delay: 1000,
                            callback: ()=>{
                                if(!puedeGirar){
                                    if(primeraCarta.type === segundaCarta.type){
                                        primeraCarta.disableInteractive();
                                        segundaCarta.disableInteractive();
                                        
                                        primeraCarta.setAlpha(0.5);
                                        segundaCarta.setAlpha(0.5);

                                        cartasSeleccionadas.push(primeraCarta);
                                        cartasSeleccionadas.push(segundaCarta);
                                    }else{
                                        primeraCarta.setTexture('duda');
                                        segundaCarta.setTexture('duda');
                                    }
                                    primeraCarta.estaVolteada = false;
                                    segundaCarta.estaVolteada = false;
                                    primeraCarta = null;
                                    segundaCarta = null;
                                    puedeGirar = true;
                                }
                            },
                            callbackScope: this
                        })
                    }

                }
            })
        }
    }
    Phaser.Utils.Array.Shuffle(masoCartas);
    Phaser.Actions.GridAlign(masoCartas, {
        width: 4,
        height: 3,
        cellWidth: 64,
        cellHeight: 64,
        x: (this.scale.width - (4 * 64)) / 2,
        y: (this.scale.height - (3 * 64)) / 2,
    });
}
function update(){
    if(masoCartas.length === cartasSeleccionadas.length){
        this.add.text(this.scale.width / 2, 100, 'Ganaste!', {color: 'black', fontWeight: 'bold'}).setOrigin(0.5);
        cartasSeleccionadas = [];
    }
}