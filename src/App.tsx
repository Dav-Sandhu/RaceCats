import { useEffect, useRef } from 'react'
import * as Phaser from 'phaser'
import './App.scss'

const SPEED: number = 48

function App() {

  const gameRef = useRef(null)

  useEffect(() => {

    class Environment extends Phaser.Scene {

      car: Phaser.Physics.Matter.Image | null
      cursors: Phaser.Types.Input.Keyboard.CursorKeys | null

      constructor(){
        super()
        this.car = null
        this.cursors = null
      }

      preload(){
        this.load.setBaseURL('/')
        this.load.spritesheet('car', 'car_24x24.png', { frameWidth: 8, frameHeight: 8 })
        this.load.image('track_image', 'road_24x24.png')
        this.load.tilemapTiledJSON('track', 'tilemap_01.json')
      }

      create(){
        
        const track = this.make.tilemap({ key: 'track' })
        const track_tileSet = track.addTilesetImage('road_24x24', 'track_image')
        track.createLayer('ground', track_tileSet || "", 0, 0)
        track.createLayer('trees', track_tileSet || "", 0, 0)
        const track_layer = track.createLayer('Tile Layer 1', track_tileSet || "", 0, 0)
        track_layer?.setCollisionByProperty({ collides: true })
        track_layer?.setCollisionFromCollisionGroup()
        track_layer ? this.matter.world.convertTilemapLayer(track_layer) : ""

        this.car = this.matter.add.sprite(48, 32, 'car')
        this.car?.setFrame(1)
        this.car?.setRectangle(3, 2, { isStatic: false })
        this.car?.setOrigin(4/8, 7/8)
        this.car?.setFixedRotation()

        this.cameras.main.startFollow(this.car)
        this.cameras.main.zoomTo(15, 0)
        this.cameras.main.roundPixels = true

        this.cursors = this.input.keyboard?.createCursorKeys() || null
      }

      update(time: number, delta: number){
        if (this.car !== null){

          const left = this.cursors?.left.isDown
          const right = this.cursors?.right.isDown
          const up = this.cursors?.up.isDown
          const down = this.cursors?.down.isDown

          let frame = this.frameSelect(left, right, up, down)

          if (frame !== -1){
            this.car?.setFrame(frame)
            const col_box = this.colBox(frame)

            const currentX = this.car.x
            const currentY = this.car.y

            this.car?.setRectangle(col_box.width, 2, { isStatic: false })
            this.car?.setOrigin(col_box.x, 7/8)

            this.car.setPosition(currentX, currentY)
          }

          const mov_x: number = left ? -1 : right ? 1 : 0
          const mov_y: number = up ? -1 : down ? 1 : 0

          this.car.setVelocity(mov_x * ( SPEED * delta / 1000 ), mov_y * ( SPEED * delta / 1000))
        }
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

    new Phaser.Game({
      type: Phaser.AUTO,
      parent: gameRef.current || "",
      pixelArt: true,
      antialias: false,
      backgroundColor: '#ffffff',
      width: 800,
      height: 600,
      physics: {
        default: 'matter',
        matter: {
          gravity: { y: 0, x: 0 },
          //debug: true,
        },
      },
      scene: Environment,
    })
  }, [])

  return (
    <div className="home">
      <h1>Race Cats Demo</h1>
      <div id="game" ref={gameRef}></div>
    </div>
  )
}

export default App
