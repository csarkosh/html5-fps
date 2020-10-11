import {Engine, Scene, Vector3, CannonJSPlugin, SceneLoader} from '@babylonjs/core'
import '@babylonjs/loaders'
import Cannon from 'cannon'
import MaterialFactory from './PBRMaterialFactory'
import RoomFactory from "./RoomFactory";
import FPSController from './FPSController'
import MathUtils from "./MathUtils";
// @ts-ignore
import ak47ModelPath from '../models/AK47.glb'

export default class Scene1 {
    private engine: Engine = null
    private isPlaying: boolean = false
    private scene: Scene = null
    private player: FPSController = null

    public init = (canvas: HTMLCanvasElement, engine: Engine): void => {
        this.engine = engine
        this.scene = new Scene(this.engine)
        const paths = ak47ModelPath.split('/')
        const filename = paths.pop()
        const rootPath = paths.join('/') + '/'
        this.scene.enablePhysics(
            new Vector3(0, -1 * MathUtils.GRAVITY_ACCELERATION, 0),
            new CannonJSPlugin(undefined, undefined, Cannon))
        this.scene.collisionsEnabled = true
        const roomFactory = new RoomFactory(this.scene, new MaterialFactory(this.scene))
        roomFactory.create()
        this.player = new FPSController(canvas, this.scene)
        SceneLoader.ImportMesh('', rootPath, filename, this.scene, ([ak47]) => {
            this.player.setGun(ak47)
        })
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
