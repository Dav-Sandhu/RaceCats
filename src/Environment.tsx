import * as Phaser from 'phaser'

class Environment extends Phaser.Scene{
    
    scene_number: number
    
    constructor(scene: number){
        super()
        this.scene_number = scene
    }

    preload(){
        this.load.setBaseURL('/')
    }

}