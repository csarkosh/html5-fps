import {
    HemisphericLight,
    Mesh,
    MeshBuilder,
    Scene,
    UniversalCamera,
    Vector3,
} from '@babylonjs/core'
import { AdvancedDynamicTexture } from "@babylonjs/gui";

class Game {
    static #DUMMY_VECTOR = Vector3.Zero()
    static #ROTATION_SPEED = 1 / 50
    static #WALK_SPEED = 13

    /** @type {UniversalCamera} */
    #camera = null
    /** @type {Engine} */
    #engine = null
    /** @type {boolean} */
    #isTouchDevice = false
    /** @type {Object.<String, Boolean>} */
    #keysDown = {}
    /** @type {number} */
    #prevMousePosX = null
    /** @type {number} */
    #prevMousePosY = null
    /** @type {Scene} */
    #scene = null
    /** @type {AdvancedDynamicTexture} */
    #ui = null

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Engine} engine
     * @return {void}
     */
    init = (canvas, engine) => {
        this.#engine = engine
        this.#scene = new Scene(this.#engine)
        this.#camera = new UniversalCamera('user', new Vector3(0, 5, -10), this.#scene)
        this.#camera.setTarget(Vector3.Zero())
        this.#camera.attachControl(canvas, true)
        this.#camera.inertia = 0
        this.#camera.rotation = Vector3.Zero()
        const light = new HemisphericLight('light1', Vector3.Up(), this.#scene)
        light.intensity = 0.7
        const sphere = Mesh.CreateSphere('sphere1', 16, 2, this.#scene)
        sphere.position.y = 2
        MeshBuilder.CreateGround('ground', { height: 50, width: 50, subdivisions: 2 })
        this.#ui = AdvancedDynamicTexture.CreateFullscreenUI('ui')
        this.setTouchDevice(this.#isTouchDevice)
        this.#scene.render()
    }

    #onKeyDown = e => this.#keysDown[e.code] = true

    #onKeyUp = e => delete this.#keysDown[e.code]

    update = () => {
        if (!this.#engine.isFullscreen) {
            this.#prevMousePosX = this.#prevMousePosY = null
            return
        }
        if (!this.#isTouchDevice && this.#prevMousePosX === null) {
            this.#prevMousePosX = this.#scene.pointerX
            this.#prevMousePosY = this.#scene.pointerY
            return
        }

        const timeDelta = this.#engine.getDeltaTime() / 1000
        this.#camera.position.y = 5
        if (this.#isTouchDevice) {
            // TODO
        } else {
            const mousePosX = this.#scene.pointerX
            const mousePosY = this.#scene.pointerY
            let rotSpeed = Game.#ROTATION_SPEED * timeDelta;
            this.#camera.rotation.x += rotSpeed * (mousePosX - this.#prevMousePosX)
            this.#camera.rotation.y += rotSpeed * (mousePosY - this.#prevMousePosY)
            const moveSum = Vector3.Zero()
            if (this.#keysDown.KeyW) {
                moveSum.z = 1
            }
            if (this.#keysDown.KeyA) {
                moveSum.x = -1
            }
            if (this.#keysDown.KeyS) {
                moveSum.z = -1
            }
            if (this.#keysDown.KeyD) {
                moveSum.x = 1
            }
            const directionalMovement = moveSum
                .normalize()
                .rotateByQuaternionToRef(this.#camera.rotation.toQuaternion(), Game.#DUMMY_VECTOR)
                .scaleInPlace(Game.#WALK_SPEED * timeDelta);
            this.#camera
                .position
                .addInPlace(directionalMovement)
            this.#prevMousePosX = mousePosX
            this.#prevMousePosY = mousePosY
        }
        this.#scene.render()
    }

    /**
     * @param {boolean} isTouchDevice
     */
    setTouchDevice = isTouchDevice => {
        this.#isTouchDevice = isTouchDevice
        if (!this.#isTouchDevice) {
            window.document.addEventListener('keydown', this.#onKeyDown, { passive: true })
            window.document.addEventListener('keyup', this.#onKeyUp, { passive: true })
        } else {
            // const ui = AdvancedDynamicTexture.CreateFullscreenUI('ui')
            // const container = new Ellipse()
            // container.name = 'move-stick'
            // container.thickness = 4
            // container.background = 'grey'
            // container.color = 'black'
            // container.paddingLeft = '0px'
            // container.paddingRight = '0px'
            // container.paddingTop = '0px'
            // container.paddingBottom = '0px'
            // container.height = '100px'
            // container.width = '100px'
            // container.isPointerBlocker = true
            // container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
            // container.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM
            // container.left = 30
            // container.top = -30
            // ui.addControl(container)
            //
            // const inner = new Ellipse()
            // inner.name = 'move-stick'
            // inner.thickness = 6
            // inner.background = 'black'
            // inner.color = 'black'
            // inner.paddingLeft = '0px'
            // inner.paddingRight = '0px'
            // inner.paddingTop = '0px'
            // inner.paddingBottom = '0px'
            // inner.height = '50px'
            // inner.width = '50px'
            // inner.isPointerBlocker = true
            // inner.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER
            // inner.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
            // container.addControl(inner)
            //
            // container.onPointerDownObservable.add(coordinates => {
            //     inner.floatLeft = coordinates.x - (container._currentMeasure.width / 2) - 30
            //     inner.left = inner.floatLeft
            //     inner.floatTop = ui._canvas.height - coordinates.y - (container._currentMeasure.height / 2) - 30
            //     inner.top = inner.floatTop * -1
            //     inner.isDown = true
            // })
            //
            // container.onPointerMoveObservable.add(coordinates => {
            //     inner.floatLeft = coordinates.x - (container._currentMeasure.width / 2) - 30
            //     inner.left = inner.floatLeft
            //     inner.floatTop = ui._canvas.height - coordinates.y - (container._currentMeasure.height / 2) - 30
            //     inner.top = inner.floatTop * -1
            // })
            //
            // container.onPointerUpObservable.add(() => {
            //     container.isDown = false
            //     inner.left = inner.top = 0
            // })
            window.document.removeEventListener('keydown', this.#onKeyDown)
            window.document.removeEventListener('keyup', this.#onKeyUp)
        }
    }

}

export default Game
