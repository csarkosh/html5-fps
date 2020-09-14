import {UniversalCamera, Vector3} from "@babylonjs/core";
import KeyboardControls from './KeyboardControls'
import TouchControls from './TouchControls'
import {AdvancedDynamicTexture} from "@babylonjs/gui";

export default class FPSController {
    /**
     * Use in place of an Vector3 that does not matter
     * @type {Vector3}
     */
    static #DUMMY_VECTOR = Vector3.Zero()

    /** @type {UniversalCamera} */
    #camera = null

    /** @type {PlayerControls} */
    #controller = null

    /** @type {Scene} */
    #scene = null

    /** @type {{ ROTATION_SPEED: number, WALK_SPEED: number }} */
    #settings = {
        ROTATION_SPEED: 1 / 6 / 1000,
        WALK_SPEED: 13 / 1000,
    }

    #ui = AdvancedDynamicTexture.CreateFullscreenUI('ui')

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Scene} scene
     * @param {boolean} [isTouch=false]
     */
    constructor(canvas, scene, isTouch = false) {
        const camera = new UniversalCamera('player', new Vector3(0,5,0), scene)
        camera.setTarget(Vector3.Zero())
        camera.attachControl(canvas)
        camera.inputs.remove(camera.inputs.attached.touch)
        camera.rotation = Vector3.Zero()
        camera.inertia = 0
        this.#camera = camera
        this.setControls(isTouch)
        this.#scene = scene
    }

    /**
     * Sets the input controller
     * @param {boolean} isTouch
     */
    setControls = isTouch => {
        const prevCtlr = this.#controller
        if (isTouch) {
            this.#controller = new TouchControls(this.#camera, this.#ui)
            this.#camera.inertia = 2
        } else {
            this.#controller = new KeyboardControls(this.#camera)
            this.#camera.inertia = 0
        }
        prevCtlr && prevCtlr.destroy()
    }

    /**
     * Updates player state
     * @param {Number} timeDelta
     */
    update = (timeDelta) => {
        // Rotation
        const rot = this.#controller.rotation()
        const rotSpeed = this.#settings.ROTATION_SPEED * timeDelta
        this.#camera.rotation.x += rotSpeed * rot.x
        this.#camera.rotation.y += rotSpeed * rot.y
        // Movement
        const directedMovement = this.#controller.direction()
            .rotateByQuaternionToRef(this.#camera.rotation.toQuaternion(), FPSController.#DUMMY_VECTOR)
            .scaleInPlace(this.#settings.WALK_SPEED * timeDelta)
        this.#camera.position.addInPlace(directedMovement)
    }
}
