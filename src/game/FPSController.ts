import {
    AbstractMesh,
    Animation,
    ParticleSystem,
    Scene,
    Sound,
    Texture,
    UniversalCamera,
    Vector3
} from "@babylonjs/core";
import KeyboardControls from './KeyboardControls'
import TouchControls from './TouchControls'
import {AdvancedDynamicTexture} from "@babylonjs/gui";
import IControls from "./IControls";
import MathUtils from "./MathUtils";
import MuzzleFlashTxr from '../textures/muzzle_flash.png'
// @ts-ignore
import SingleShot from '../audio/ak47-single.mp3'

interface ISettingsMap {
    ENABLE_NO_CLIP: boolean,
    ROTATION_SPEED: number,
    RUN_SPEED: number
    WALK_SPEED: number
}

export default class FPSController {
    private static HEIGHT = MathUtils.inches2meters(73)
    private static WIDTH = MathUtils.inches2meters(48)
    private static DEPTH = MathUtils.inches2meters(48)
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
        ENABLE_NO_CLIP: true,
        ROTATION_SPEED: 1 / 6 / 1000,
        WALK_SPEED: 13 / 1000,
        RUN_SPEED: 26 / 1000,
    }

    private muzzleFlash: ParticleSystem = null

    private singleShot: Sound

    private ui: AdvancedDynamicTexture = AdvancedDynamicTexture.CreateFullscreenUI('ui')

    public constructor(canvas: HTMLCanvasElement, scene: Scene, isTouch: boolean = false) {
        this.scene = scene
        const camera = new UniversalCamera('player', new Vector3(0,FPSController.HEIGHT - FPSController.HEAD_HEIGHT / 2,0), scene)
        camera.setTarget(Vector3.Zero())
        camera.attachControl(canvas, true)
        camera.inputs.remove(camera.inputs.attached.touch)
        camera.rotation = Vector3.Zero()
        camera.inertia = 0
        camera.applyGravity = true
        camera.checkCollisions = true
        camera.ellipsoid = new Vector3(FPSController.WIDTH, FPSController.HEAD_HEIGHT, FPSController.DEPTH)
        camera.keysLeft = [37, 65]
        camera.keysRight = [39, 68]
        camera.keysUp = [38, 87]
        camera.keysDown = [40, 83]

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
        gun.position = new Vector3(this.getGunOffset(), -0.7, 2)
        gun.parent = this.camera
        this.gun = gun

        const anim = new Animation('recoil', 'position.z', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
        const originPosX = gun.position.z
        anim.setKeys([
            { frame: 0, value:  originPosX},
            { frame: 1, value: originPosX - 0.25 },
            { frame: 6, value: originPosX },
        ])
        gun.animations = [anim]

        this.singleShot = new Sound('singleshot', SingleShot, this.scene)

        // Muzzle flash
        const flash = new ParticleSystem('flash', 1, this.scene)
        flash.emitter = gun
        flash.particleTexture = new Texture(MuzzleFlashTxr, this.scene)
        flash.isLocal = true
        flash.minEmitBox = new Vector3(1,1.5,0.75)
        flash.maxEmitBox = new Vector3(-1,1.5,0.75)
        flash.targetStopDuration = 0.1
        flash.minLifeTime = 0.05
        flash.maxLifeTime = 0.1
        flash.minEmitPower = 10
        flash.maxEmitPower = 10
        flash.direction1 = new Vector3(1,0,0)
        flash.direction2 = new Vector3(1,0,0)
        flash.minSize = 0.75
        flash.maxSize = 0.75
        flash.manualEmitCount = 0
        this.muzzleFlash = flash
    }

    /**
     * Updates player state
     */
    public update = (timeDelta: number): void => {
        this.rotate(timeDelta)
        //this.move(timeDelta)
        if (this.gun) {
            this.gun.position.x = this.getGunOffset()
        }
        if (this.controller.isFiring()) {
            this.scene.beginAnimation(this.gun, 0, 6)
            this.muzzleFlash.manualEmitCount++
            this.muzzleFlash.start()
            this.singleShot.play()
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
        this.camera.position.addInPlace(directedMovement)
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

    private getGunOffset = (): number => {
        const ratio = window.innerHeight / window.innerWidth
        if (ratio > 2.10) {
            return 0.2
        } else if (ratio > 1.63) {
            return 0.3
        } else if (ratio > 0.4) {
            return 0.4
        }
        return 0.5
    }
}
