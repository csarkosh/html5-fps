import {Engine, Scene, Vector3, CannonJSPlugin} from '@babylonjs/core'
import Cannon from 'cannon'
import MaterialFactory from './PBRMaterialFactory'
import RoomFactory from "./RoomFactory";
import FPSController from './FPSController'
import MathUtils from "./MathUtils";

export default class Scene1 {
    private engine: Engine = null
    private isPlaying: boolean = false
    private scene: Scene = null
    private player: FPSController = null

    public init = (canvas: HTMLCanvasElement, engine: Engine): void => {
        this.engine = engine
        this.scene = new Scene(this.engine)
        this.scene.enablePhysics(
            new Vector3(0, -1 * MathUtils.GRAVITY_ACCELERATION, 0),
            new CannonJSPlugin(undefined, undefined, Cannon))
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
