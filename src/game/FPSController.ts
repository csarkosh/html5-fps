import {Animation, CircleEase, EasingFunction, Scene, UniversalCamera, Vector3} from "@babylonjs/core";
import KeyboardControls from './KeyboardControls'
import TouchControls from './TouchControls'
import {AdvancedDynamicTexture} from "@babylonjs/gui";
import IControls from "./IControls";
import MathUtils from "./MathUtils";

interface ISettingsMap {
    ENABLE_NO_CLIP: boolean,
    ROTATION_SPEED: number,
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

    private jumpAnimation: Animation = null

    private scene: Scene = null

    private settings: ISettingsMap = {
        ENABLE_NO_CLIP: false,
        ROTATION_SPEED: 1 / 6 / 1000,
        WALK_SPEED: 13 / 1000,
    }

    private ui: AdvancedDynamicTexture = AdvancedDynamicTexture.CreateFullscreenUI('ui')

    public constructor(canvas: HTMLCanvasElement, scene: Scene, isTouch: boolean = false) {
        this.scene = scene
        // Create camera
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
        // Create jump animation
        const easeFunc = new CircleEase()
        easeFunc.setEasingMode(EasingFunction.EASINGMODE_EASEINOUT)
        this.jumpAnimation = new Animation('jump', 'position.y', 10, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE)
        this.jumpAnimation.setEasingFunction(easeFunc)
        this.jumpAnimation.setKeys([
            { frame: 0, value: this.camera.position.y },
            { frame: 3, value: this.camera.position.y + MathUtils.inches2meters(24) },
            { frame: 10, value: this.camera.position.y }
        ])
        // Set controller
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
            this.controller = new KeyboardControls(this.camera)
            this.camera.inertia = 0
        }
        prevCtlr && prevCtlr.destroy()
    }

    /**
     * Updates player state
     */
    public update = (timeDelta: number): void => {
        this.rotate(timeDelta)
        this.move(timeDelta)
        this.jump(timeDelta)
    }

    private jump = (timeDelta: number): void => {
        if (!this.controller.isJumping()) {
            return;
        }
        this.camera.animations.push(this.jumpAnimation)
        this.scene.beginAnimation(this.camera, 0, 10, false)
    }

    /**
     * Moves the player within the X-Z coordinate space
     */
    private move = (timeDelta: number): void => {
        const moveRot = this.camera.rotation.clone()
        if (!this.settings.ENABLE_NO_CLIP) {
            moveRot.x = 0
        }
        const directedMovement = this.controller.direction()
            .rotateByQuaternionToRef(moveRot.toQuaternion(), FPSController.DUMMY_VECTOR)
            .scaleInPlace(this.settings.WALK_SPEED * timeDelta)
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
}
