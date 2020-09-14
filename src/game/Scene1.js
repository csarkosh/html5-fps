import { Scene } from '@babylonjs/core'
import MaterialFactory from './PBRMaterialFactory.ts'
import RoomFactory from "./RoomFactory";
import FPSController from './FPSController'

export default class Scene1 {
    /** @type {Engine} */
    #engine = null
    /** @type {boolean} */
    #isPlaying = false
    /** @type {Scene} */
    #scene = null
    /** @type {FPSController} */
    #player = null

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Engine} engine
     * @return {void}
     */
    init = (canvas, engine) => {
        this.#engine = engine
        this.#scene = new Scene(this.#engine)
        const roomFactory = new RoomFactory(this.#scene, new MaterialFactory(this.#scene))
        roomFactory.create()
        this.#player = new FPSController(canvas, this.#scene)
        this.#scene.render()
    }

    pause = () => this.#isPlaying = false

    play = () => this.#isPlaying = true

    update = () => {
        if (!this.#isPlaying) {
            this.#scene.render()
            return
        }
        const timeDelta = this.#engine.getDeltaTime()
        this.#player.update(timeDelta)
        this.#scene.render()
    }

    /**
     * @param {boolean} isTouchDevice
     */
    setTouchDevice = isTouchDevice => {
        this.#player.setControls(isTouchDevice)
    }
}
