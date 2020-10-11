import {Engine, Scene, Vector3, CannonJSPlugin, SceneLoader, AbstractMesh} from '@babylonjs/core'
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
        this.scene.enablePhysics(
            new Vector3(0, -1 * MathUtils.GRAVITY_ACCELERATION, 0),
            new CannonJSPlugin(undefined, undefined, Cannon))
        this.scene.collisionsEnabled = true
        const roomFactory = new RoomFactory(this.scene, new MaterialFactory(this.scene))
        roomFactory.create()
        this.player = new FPSController(canvas, this.scene)

        const [ak47Root, ak47Name] = this.splitPathName(ak47ModelPath)
        SceneLoader.ImportMesh('', ak47Root, ak47Name, this.scene, (meshes: AbstractMesh[]) => {
            meshes.forEach((mesh: AbstractMesh) => mesh.renderingGroupId = 1)
            this.player.setGun(meshes[0])
        })

        this.scene.render()
    }

    private splitPathName = (fullPath: string): string[] => {
        const paths = fullPath.split('/')
        const name = paths.pop()
        const root = paths.join('/') + '/'
        return [root, name]
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
