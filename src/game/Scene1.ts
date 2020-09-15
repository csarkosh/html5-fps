import {Engine, Scene} from '@babylonjs/core'
import MaterialFactory from './PBRMaterialFactory'
import RoomFactory from "./RoomFactory";
import FPSController from './FPSController'

export default class Scene1 {
    private engine: Engine = null
    private isPlaying: boolean = false
    private scene: Scene = null
    private player: FPSController = null

    public init = (canvas: HTMLCanvasElement, engine: Engine): void => {
        this.engine = engine
        this.scene = new Scene(this.engine)
        const roomFactory = new RoomFactory(this.scene, new MaterialFactory(this.scene))
        roomFactory.create()
        this.player = new FPSController(canvas, this.scene)
        this.scene.render()
    }

    public pause = (): void => {
        this.isPlaying = false
    }

    public play = (): void => {
        this.isPlaying = true
    }

    public update = (): void => {
        if (!this.isPlaying) {
            this.scene.render()
            return
        }
        const timeDelta = this.engine.getDeltaTime()
        this.player.update(timeDelta)
        this.scene.render()
    }

    public setTouchDevice = (isTouchDevice: boolean): void => {
        this.player.setControls(isTouchDevice)
    }
}
