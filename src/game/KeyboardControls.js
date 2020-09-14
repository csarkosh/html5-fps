import PlayerControls from "./PlayerControls";
import {Vector2, Vector3} from "@babylonjs/core";

export default class KeyboardControls extends PlayerControls {
    /** @type {UniversalCamera} */
    #camera = null

    /** @type {Object.<string, boolean>} */
    #keysDown = {}

    /**
     * Previous mouse position
     * @type {Vector2}
     */
    #prevPos = null

    /**
     * Memoized instance for returning rotation data (prevents
     * repeated instantiation in render loop)
     *
     * WARNING: Unsafe to read from internally
     * @type {Vector2}
     */
    #rotationRet = Vector2.Zero()

    /** @type {Scene} */
    #scene = null

    /**
     * @param {UniversalCamera} camera
     */
    constructor(camera) {
        super()
        const scene = camera.getScene()
        this.#camera = camera
        this.#prevPos = new Vector2(scene.pointerX, scene.pointerY)
        this.#scene = scene
        window.addEventListener('keydown', this.#onKeyDown)
        window.addEventListener('keyup', this.#onKeyUp)
    }

    destroy = () => {
        window.removeEventListener('keydown', this.#onKeyDown)
        window.removeEventListener('keyup', this.#onKeyUp)
    }

    /**
     * Returns the intended movement direction
     * @return {Vector3}
     */
    direction = () => {
        const dir = Vector3.Zero()
        if (this.#keysDown.KeyW) {
            dir.z = 1
        }
        if (this.#keysDown.KeyA) {
            dir.x = -1
        }
        if (this.#keysDown.KeyS) {
            dir.z = -1
        }
        if (this.#keysDown.KeyD) {
            dir.x = 1
        }
        dir.normalize()
        return dir
    }

    /**
     *
     * @return {Vector2}
     */
    rotation = () => {
        const currPosX = this.#scene.pointerX
        const currPosY = this.#scene.pointerY
        this.#rotationRet.set(currPosX - this.#prevPos.x, currPosY - this.#prevPos.y)
        this.#prevPos.set(currPosX, currPosY)
        return this.#rotationRet
    }

    /**
     * @param {KeyboardEvent} e
     */
    #onKeyDown = e => this.#keysDown[e.code] = true

    /**
     * @param {KeyboardEvent} e
     */
    #onKeyUp = e => this.#keysDown[e.code] = false
}
