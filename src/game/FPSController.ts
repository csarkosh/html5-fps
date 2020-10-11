import {AbstractMesh, Scene, UniversalCamera, Vector3} from "@babylonjs/core";
import KeyboardControls from './KeyboardControls'
import TouchControls from './TouchControls'
import {AdvancedDynamicTexture} from "@babylonjs/gui";
import IControls from "./IControls";
import MathUtils from "./MathUtils";

interface ISettingsMap {
    ENABLE_NO_CLIP: boolean,
    ROTATION_SPEED: number,
    RUN_SPEED: number
    WALK_SPEED: number
}

export default class FPSController {
    private static HEIGHT = MathUtils.inches2meters(73)
    private static WIDTH = MathUtils.inches2meters(24)
    private static DEPTH = MathUtils.inches2meters(12)
    private static HEAD_HEIGHT = MathUtils.inches2meters(22)

    /**
     * Use in place of an Vector3 that does not matter
     */
    private static DUMMY_VECTOR: Vector3 = Vector3.Zero()

    private readonly camera: UniversalCamera = null

    private controller: IControls = null

    private scene: Scene = null

    private gun: AbstractMesh

    private settings: ISettingsMap = {
        ENABLE_NO_CLIP: false,
        ROTATION_SPEED: 1 / 6 / 1000,
        WALK_SPEED: 13 / 1000,
        RUN_SPEED: 26 / 1000,
    }

    private ui: AdvancedDynamicTexture = AdvancedDynamicTexture.CreateFullscreenUI('ui')

    public constructor(canvas: HTMLCanvasElement, scene: Scene, isTouch: boolean = false) {
        this.scene = scene
        const camera = new UniversalCamera('player', new Vector3(0,FPSController.HEIGHT - FPSController.HEAD_HEIGHT / 2,0), scene)
        camera.setTarget(Vector3.Zero())
        camera.attachControl(canvas)
        camera.inputs.remove(camera.inputs.attached.touch)
        camera.rotation = Vector3.Zero()
        camera.inertia = 0
        camera.applyGravity = true
        camera.checkCollisions = true
        camera.ellipsoid = new Vector3(FPSController.WIDTH, FPSController.HEAD_HEIGHT, FPSController.DEPTH)
        this.camera = camera
        this.setControls(isTouch)
    }

    /**
     * Sets the input controller
     */
    public setControls = (isTouch: boolean): void => {
        const prevCtlr = this.controller
        if (isTouch) {
            this.controller = new TouchControls(this.camera, this.ui)
            this.camera.inertia = 2
        } else {
            this.controller = new KeyboardControls(this.camera, this.ui)
            this.camera.inertia = 0
        }
        prevCtlr && prevCtlr.destroy()
    }

    public setGun = (gun: AbstractMesh): void => {
        gun.scaling = new Vector3(0.25, 0.25, 0.25)
        gun.rotation = this.camera.rotation.add(new Vector3(0, 3 * Math.PI / 2, 0))
        gun.position = new Vector3(0.5, -0.7, 2)
        gun.parent = this.camera
        this.gun = gun
    }

    /**
     * Updates player state
     */
    public update = (timeDelta: number): void => {
        this.rotate(timeDelta)
        this.move(timeDelta)
        if (this.gun) {
            this.gun.position.x = window.innerWidth < 600 ? 0.3 : 0.5
        }
    }

    /**
     * Moves the player within the X-Z coordinate space
     */
    private move = (timeDelta: number): void => {
        const moveRot = this.camera.rotation.clone()
        if (!this.settings.ENABLE_NO_CLIP) {
            moveRot.x = 0
        }
        const speed = this.controller.isRunning() ? this.settings.RUN_SPEED : this.settings.WALK_SPEED
        const directedMovement = this.controller.direction()
            .rotateByQuaternionToRef(moveRot.toQuaternion(), FPSController.DUMMY_VECTOR)
            .scaleInPlace(speed * timeDelta)
        const newPos = this.camera.position.add(directedMovement)
        newPos.x = MathUtils.clamp(newPos.x, -48, 48)
        newPos.z = MathUtils.clamp(newPos.z, -48, 48)
        this.camera.position = newPos
    }

    /**
     * Rotates the forward direction of the player
     */
    private rotate = (timeDelta: number): void => {
        const rot = this.controller.rotation()
        const rotSpeed = this.settings.ROTATION_SPEED * timeDelta
        this.camera.rotation.x += rotSpeed * rot.x
        this.camera.rotation.y += rotSpeed * rot.y
    }
}
