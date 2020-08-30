import {
    HemisphericLight,
    Mesh,
    MeshBuilder, PointerEventTypes,
    Scene,
    UniversalCamera,
    Vector3,
} from '@babylonjs/core'
import {AdvancedDynamicTexture, Control, Ellipse} from "@babylonjs/gui";

export default class GameScene {
    static #DUMMY_VECTOR = Vector3.Zero()
    static #ROTATION_SPEED = 1 / 50
    static #TOUCH_ROTATION_SPEED = 1 / 6
    static #WALK_SPEED = 13

    /** @type {UniversalCamera} */
    #camera = null
    /** @type {Engine} */
    #engine = null
    /** @type {boolean} */
    #isMoveStickDown = false
    /** @type {boolean} */
    #isPlaying = false
    /** @type {boolean} */
    #isTouchDevice = false
    /** @type {Object.<String, Boolean>} */
    #keysDown = {}
    /** @type {Container} */
    #moveStickContainer = null
    /** @type {Container} */
    #moveStickPoint = null
    /** @type {number} */
    #prevMousePosX = null
    /** @type {number} */
    #prevMousePosY = null
    /** @type {Scene} */
    #scene = null
    /** @type {Observer} */
    #touchDeviceObserver = null
    /** @type {Object<string, number>} */
    #touchInfo = {}
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
        const camera = new UniversalCamera('user', new Vector3(0, 5, -10), this.#scene)
        camera.setTarget(Vector3.Zero())
        camera.attachControl(canvas, true)
        camera.inputs.remove(camera.inputs.attached.touch)
        camera.rotation = Vector3.Zero()
        this.#camera = camera
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

    pause = () => this.#isPlaying = false

    play = () => this.#isPlaying = true

    update = () => {
        if (!this.#isPlaying) {
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
            if (this.#isMoveStickDown) {
                const moveDirection = Vector3.Zero()
                moveDirection.z = -1 * this.#moveStickPoint.topInPixels
                moveDirection.x = this.#moveStickPoint.leftInPixels
                moveDirection.normalize()
                const directionalMovement = moveDirection
                    .rotateByQuaternionToRef(this.#camera.rotation.toQuaternion(), GameScene.#DUMMY_VECTOR)
                    .scaleInPlace(GameScene.#WALK_SPEED * timeDelta)
                this.#camera
                    .position
                    .addInPlace(directionalMovement)
            }
        } else {
            // Rotation
            const mousePosX = this.#scene.pointerX
            const mousePosY = this.#scene.pointerY
            const rotSpeed = GameScene.#ROTATION_SPEED * timeDelta;
            this.#camera.rotation.x += rotSpeed * (mousePosX - this.#prevMousePosX)
            this.#camera.rotation.y += rotSpeed * (mousePosY - this.#prevMousePosY)
            // Movement
            const moveDirection = Vector3.Zero()
            if (this.#keysDown.KeyW) {
                moveDirection.z = 1
            }
            if (this.#keysDown.KeyA) {
                moveDirection.x = -1
            }
            if (this.#keysDown.KeyS) {
                moveDirection.z = -1
            }
            if (this.#keysDown.KeyD) {
                moveDirection.x = 1
            }
            moveDirection.normalize()
            const directionalMovement = moveDirection
                .rotateByQuaternionToRef(this.#camera.rotation.toQuaternion(), GameScene.#DUMMY_VECTOR)
                .scaleInPlace(GameScene.#WALK_SPEED * timeDelta);
            this.#camera
                .position
                .addInPlace(directionalMovement)
            this.#prevMousePosX = mousePosX
            this.#prevMousePosY = mousePosY
        }
        this.#scene.render()
        window.camera = this.#camera
        window.scene = this.#scene
    }

    /**
     * @param {boolean} isTouchDevice
     */
    setTouchDevice = isTouchDevice => {
        this.#isTouchDevice = isTouchDevice
        if (this.#isTouchDevice) {
            window.document.removeEventListener('keydown', this.#onKeyDown)
            window.document.removeEventListener('keyup', this.#onKeyUp)
            this.#camera.inertia = 2
            this.#createMoveStick()
            this.#touchDeviceObserver = this.#scene.onPointerObservable.add(info => {
                if (info.type === PointerEventTypes.POINTERDOWN && !this.#touchInfo.id) {
                    this.#touchInfo.id = info.event.pointerId
                    this.#touchInfo.posX = this.#scene.pointerX
                    this.#touchInfo.posY = this.#scene.pointerY
                }
                if (this.#touchInfo.id === info.event.pointerId) {
                    if (info.type === PointerEventTypes.POINTERUP) {
                        delete this.#touchInfo.id
                        delete this.#touchInfo.posX
                        delete this.#touchInfo.posY
                    } else if (info.type === PointerEventTypes.POINTERMOVE) {
                        const timeDelta = this.#engine.getDeltaTime() / 1000
                        const posX = this.#scene.pointerX
                        const posY = this.#scene.pointerY
                        const rotSpeed = GameScene.#TOUCH_ROTATION_SPEED * timeDelta;
                        // Translation between touch screen coordinates and camera rotation
                        // coordinates are inverse of each other
                        this.#camera.rotation.x += rotSpeed * (posY - this.#touchInfo.posY)
                        this.#camera.rotation.y += rotSpeed * (posX - this.#touchInfo.posX)
                        this.#touchInfo.posX = posX
                        this.#touchInfo.posY = posY
                    }
                } else if (info.type === PointerEventTypes.POINTERMOVE && this.#isMoveStickDown) {
                    // Translate `moveStickPoint` to point of touch and clamp translation
                    // to `moveStickContainer` circumference
                    const radius = this.#moveStickContainer._currentMeasure.width / 2 - 5
                    const { clientX, clientY } = info.event
                    const left = (clientX - this.#moveStickContainer.centerX)
                    const top = (clientY - this.#moveStickContainer.centerY)
                    const magnitude = Math.sqrt(Math.pow(left, 2) + Math.pow(top, 2))
                    const clampLeft = radius * left / magnitude
                    const clampTop = radius * top / magnitude
                    this.#moveStickPoint.left = left.clamp(-1 * clampLeft, clampLeft)
                    this.#moveStickPoint.top = top.clamp(-1 * clampTop, clampTop)
                }
            })
        } else {
            window.document.addEventListener('keydown', this.#onKeyDown, { passive: true })
            window.document.addEventListener('keyup', this.#onKeyUp, { passive: true })
            this.#camera.inertia = 0
            this.#scene.onPointerObservable.remove(this.#touchDeviceObserver)
        }
    }

    #createMoveStick = () => {
        const diameter = 120
        const ui = AdvancedDynamicTexture.CreateFullscreenUI('ui')
        const container = new Ellipse()
        container.name = 'move-stick'
        container.thickness = 4
        container.background = 'grey'
        container.color = 'black'
        container.paddingLeft = '0px'
        container.paddingRight = '0px'
        container.paddingTop = '0px'
        container.paddingBottom = '0px'
        container.height = `${diameter}px`
        container.width = `${diameter}px`
        container.isPointerBlocker = true
        container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
        container.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM
        container.left = 30
        container.top = -30
        ui.addControl(container)
        const inner = new Ellipse()
        inner.name = 'move-stick'
        inner.thickness = 6
        inner.background = 'black'
        inner.color = 'black'
        inner.paddingLeft = '0px'
        inner.paddingRight = '0px'
        inner.paddingTop = '0px'
        inner.paddingBottom = '0px'
        inner.height = '50px'
        inner.width = '50px'
        inner.isPointerBlocker = true
        inner.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER
        inner.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER
        container.addControl(inner)
        const radius = diameter / 2 - 5
        container.onPointerDownObservable.add(coordinates => {
            inner.left = (coordinates.x - container.centerX)
            inner.top  = (coordinates.y - container.centerY)
            this.#isMoveStickDown = true
        })
        container.onPointerMoveObservable.add(coordinates => {
            const left = (coordinates.x - this.#moveStickContainer.centerX)
            const top = (coordinates.y - this.#moveStickContainer.centerY)
            const magnitude = Math.sqrt(Math.pow(left, 2) + Math.pow(top, 2))
            const clampLeft = radius * left / magnitude
            const clampTop = radius * top / magnitude
            inner.left = left.clamp(-1 * clampLeft, clampLeft)
            inner.top = top.clamp(-1 * clampTop, clampTop)
        })
        container.onPointerUpObservable.add(() => {
            inner.left = inner.top = 0
            this.#isMoveStickDown = false
        })
        this.#ui = ui
        this.#moveStickPoint = inner
        this.#moveStickContainer = container
    }

}
