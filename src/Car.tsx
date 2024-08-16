import * as Phaser from 'phaser'

export class Car extends Phaser.Physics.Matter.Image{

    cursors: Phaser.Types.Input.Keyboard.CursorKeys | null
    player: boolean
    speed: number

    constructor(
        world: Phaser.Physics.Matter.World, 
        x: number, y: number, 
        texture: string | Phaser.Textures.Texture, 
        player: boolean, speed: number){
        
        super(world, x, y, texture)

        this.cursors = null
        this.player = player
        this.speed = speed
    }

    moveCar(delta: number){

        let mov_x = 0
        let mov_y = 0

        let frame = -1

        const dir = this.player ? this.keyboardInput() : this.enemyInput()

        if (dir !== null){
            const { left, right, up, down } = dir
            frame = this.frameSelect(left, right, up, down)

            mov_x = left ? -1 : right ? 1 : 0
            mov_y = up ? -1 : down ? 1 : 0
        }

        if (frame !== -1) {
            this.setFrame(frame)
            const col_box = this.colBox(frame)
    
            const currentX = this.x
            const currentY = this.y
    
            this.setRectangle(col_box.width, 2, { isStatic: false })
            this.setOrigin(col_box.x, 7/8)
    
            this.setPosition(currentX, currentY)
        }

        this.setVelocity(mov_x * (this.speed * delta / 1000), mov_y * (this.speed * delta / 1000))    
    }

    keyboardInput(){
        if (this.cursors) {
            const left = this.cursors.left.isDown
            const right = this.cursors.right.isDown
            const up = this.cursors.up.isDown
            const down = this.cursors.down.isDown

            return { left, right, up, down }
        }

        return null
    }

    enemyInput(){
        return null
    }

    frameSelect(
        left: boolean | undefined, 
        right: boolean | undefined, 
        up: boolean | undefined, 
        down: boolean | undefined): number{
        
        if (left && (!up && !down)){ return 3 }
        else if (left && up){ return 0 }
        else if (left && down){ return 6 }
        else if (right && (!up && !down)){ return 5 }
        else if (right && up){ return 2 }
        else if (right && down){ return 8 }
        else if (up){ return 1 }
        else if (down){ return 7 }

        return -1
      }

    colBox(frame: number): { width: number, x: number }{
        switch(frame){
            case 0:
            return { width: 5, x: 6/8 }
            case 1:
            return { width: 3, x: 4/8 }
            case 2: 
            return { width: 5, x: 3/8 }
            case 3:
            return { width: 6, x: 5/8  }
            case 5:
            return { width: 6, x: 3/8 }
            case 6: 
            return { width: 5, x: 5/8 }
            case 7:
            return { width: 3, x: 4/8 }
            case 8:
            return { width: 5, x: 3/8 }
            default: 
            return { width: -1, x: -1 }
        }
    }
}