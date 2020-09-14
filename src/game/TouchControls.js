import PlayerControls from "./PlayerControls";
import GUIFactory from "./GUIFactory";
import {PointerEventTypes, Vector2} from "@babylonjs/core";
import {Vector3} from "@babylonjs/core/Maths/math.vector";

export default class TouchControls extends PlayerControls {
    /** @type {UniversalCamera} */
    #camera = null

    /** @type {Control} */
    #container = null

    #directionRet = Vector3.Zero()

    /** @type {Control} */
    #inner = null

    /** @type {boolean} */
    #isJoystickDown = false

    /**
     * Next touch position
     * @type {Vector2}
     */
    #nextPos = null

    /**
     * Previous touch position
     * @type {Vector2}
     */
    #prevPos = null

    /** @type {number} */
    #screenPointerId = -1

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

    /** @type {AdvancedDynamicTexture} */
    #ui = null

    /**
     * @param {UniversalCamera} camera
     * @param {AdvancedDynamicTexture} ui
     */
    constructor(camera, ui) {
        super()
        const scene = camera.getScene()
        this.#camera = camera
        this.#scene = scene
        this.#ui = ui
        const {container, inner} = GUIFactory.createVirtualJoystick(ui)
        this.#container = container
        this.#inner = inner
        this.#container.onPointerDownObservable.add(this.#onJoystickPointerDown)
        this.#container.onPointerMoveObservable.add(this.#onJoystickPointerDown)
        this.#container.onPointerUpObservable.add(this.#onJoystickPointerUp)
        this.#scene.onPointerObservable.add(this.#onScenePointerObservable)
    }

    destroy = () => {
        this.#inner.dispose()
        this.#container.dispose()
        this.#scene.onPointerObservable.removeCallback(this.#onScenePointerObservable)
    }

    /**
     * @return {Vector3}
     */
    direction = () => {
        const dir = this.#directionRet
        dir.setAll(0)
        if (this.#isJoystickDown) {
            dir.x = this.#inner.leftInPixels
            dir.z = -1 * this.#inner.topInPixels
            dir.normalize()
        }
        return dir
    }

    /**
     * @return {Vector2}
     */
    rotation = () => {
        if (this.#nextPos) {
            const deltaX = this.#nextPos.x - this.#prevPos.x;
            const deltaY = this.#nextPos.y - this.#prevPos.y;
            this.#prevPos.set(this.#nextPos.x, this.#nextPos.y)
            this.#rotationRet.set(deltaY, deltaX)
        }
        return this.#rotationRet
    }

    /**
     * @param {PointerInfo} info
     */
    #onScenePointerObservable = info => {
        const pointerId = info.event.pointerId;
        const type = info.type;
        if (type === PointerEventTypes.POINTERDOWN && this.#screenPointerId === -1) {
            this.#screenPointerId = pointerId
            this.#prevPos = new Vector2(this.#scene.pointerX, this.#scene.pointerY)
            this.#nextPos = this.#prevPos.clone()
        }
        if (this.#screenPointerId === pointerId) {
            if (type === PointerEventTypes.POINTERUP) {
                this.#screenPointerId = -1
                this.#rotationRet.set(0, 0)
            } else if (type === PointerEventTypes.POINTERMOVE) {
                const { clientX, clientY } = info.event
                this.#nextPos.set(clientX, clientY)
            }
        } else if (type === PointerEventTypes.POINTERMOVE && this.#isJoystickDown) {
            // Clamp and update joystick inner when pointer is moved off joystick
            // container w/o lifting pointer
            const { clientX, clientY } = info.event
            const left = (clientX - this.#container.centerX)
            const top = (clientY - this.#container.centerY)
            const magnitude = Math.sqrt(left ** 2 + top ** 2)
            const radius = this.#container.widthInPixels/ 2
            this.#inner.left = radius * left / magnitude
            this.#inner.top = radius * top / magnitude
        }
    }

    /**
     * @param {Vector2} coordinates
     */
    #onJoystickPointerDown = coordinates => {
        this.#inner.left = coordinates.x - this.#container.centerX
        this.#inner.top = coordinates.y - this.#container.centerY
        this.#isJoystickDown = true
    }

    #onJoystickPointerUp = () => {
        this.#inner.left = this.#inner.top = 0
        this.#isJoystickDown = false
    }
}
