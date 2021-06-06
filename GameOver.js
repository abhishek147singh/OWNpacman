class GameOver extends Phaser.Scene{
    constructor(){
        super({key:"Example2"});
    }
    create(){
        this.text = this.add.text(0,0,`${state} ! `,{font:'50px Impact'});
        this.text2 = this.add.text(192,200,"Press Space bar for Start Again!",{font:'40px Impact',color:'fff'});
        this.text3 = this.add.text(230,150,`Your score is ${score}`,{font:'45px Impact',color:'blue'});
        let tween = this.tweens.add({
            targets:this.text,
            x:280,
            y:250,
            duration:2000,
            ease:'Elastic',
            easeParams:[1.5,0.5],
            delay:1000 ,
            onComplete:function(src,target){
                    target[0].x = 280;
                    target[0].y = 280;
                    target[0].setColor('red');
            }    
        },this);

        let tween2 = this.tweens.add({
            targets:this.text2,
            x:150,
            y:200,
            duration:2000,
            ease:'Elastic',
            easeParams:[1.5,0.5],
            delay:1000 ,
            onComplete:function(src,target){
                    target[0].x = 152;
                    target[0].y = 210;
                    target[0].setColor('green');
            }    
        },this);

       // this.key_1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
       cursors = this.input.keyboard.createCursorKeys();
    }
    update(dalta)
    {
        if (cursors.space.isDown) {
            this.scene.start('Example6');
        }
    }
}