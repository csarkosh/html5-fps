import {
    Color3,
    HemisphericLight,
    MeshBuilder,
    PointerEventTypes,
    PointLight,
    Scene,
    TransformNode,
    UniversalCamera,
    Vector3,
} from '@babylonjs/core'
import {AdvancedDynamicTexture, Control, Ellipse} from "@babylonjs/gui";

import getMaterial from './create-pbr'

export default class Scene1 {
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
        const camera = new UniversalCamera('user', new Vector3(0, 5, 0), this.#scene)
        camera.setTarget(Vector3.Zero())
        camera.attachControl(canvas, true)
        camera.inputs.remove(camera.inputs.attached.touch)
        camera.rotation = Vector3.Zero()
        this.#camera = camera


        const root = new TransformNode('root')
        const ground = MeshBuilder.CreateGround('ground', { height: 50, width: 50, subdivisions: 1 })
        ground.parent = root

        const WALL_HEIGHT = 35
        const WALL_WIDTH = 100
        const wall1 = MeshBuilder.CreatePlane('wall1', { height: WALL_HEIGHT, width: WALL_WIDTH })
        wall1.parent = root
        wall1.position = new Vector3(0, WALL_HEIGHT / 2, 50)
        wall1.rotation = Vector3.Zero()
        const wall2 = MeshBuilder.CreatePlane('wall2', { height: WALL_HEIGHT, width: WALL_WIDTH })
        wall2.parent = root
        wall2.position = new Vector3(50, WALL_HEIGHT / 2, 0)
        wall2.rotation = new Vector3(0, Math.PI / 2, 0)
        const wall3 = MeshBuilder.CreatePlane('wall3', { height: WALL_HEIGHT, width: WALL_WIDTH })
        wall3.parent = root
        wall3.position = new Vector3(0, WALL_HEIGHT / 2, -50)
        wall3.rotation = new Vector3(0, Math.PI, 0)
        const wall4 = MeshBuilder.CreatePlane('wall4', { height: WALL_HEIGHT, width: WALL_WIDTH })
        wall4.parent = root
        wall4.position = new Vector3(-50, WALL_HEIGHT / 2, 0)
        wall4.rotation = new Vector3(0, 3 * Math.PI / 2, 0)

        const hemLight = new HemisphericLight('hemLight', Vector3.Up(), this.#scene)
        hemLight.groundColor = new Color3(36 / 255, 40 / 255, 60 / 255)
        hemLight.diffuse = new Color3(235 / 255, 225 / 255, 250 / 255)
        hemLight.specular = Color3.White()
        hemLight.intensity = 0.4

        const light = new PointLight('light', new Vector3(-25, 10, -25), this.#scene)
        light.diffuse = Color3.White()
        light.specular = Color3.White()
        light.groundColor = Color3.White()
        light.intensity = 20
        light.parent = root

        const light2 = new PointLight('light2', new Vector3(-25, 10, 25), this.#scene)
        light2.diffuse = Color3.White()
        light2.specular = Color3.White()
        light2.groundColor = Color3.White()
        light2.intensity = 20
        light2.parent = root

        const light3 = new PointLight('light3', new Vector3(25, 10, 0), this.#scene)
        light3.diffuse = Color3.White()
        light3.specular = Color3.White()
        light3.groundColor = Color3.White()
        light3.intensity = 20
        light3.parent = root

        const pbr1 = getMaterial('Metal_Plate_15', 'floor1', this.#scene, {
            parallaxScaleBias: 0.01,
            uScale: 20,
            vScale: 20,
        })
        const pbr2 = getMaterial('Metal_Plate_41', 'wall1', this.#scene, {
            uScale: 2 * WALL_WIDTH / WALL_HEIGHT,
            vScale: 2
        })

        ground.material = pbr1
        wall1.material = wall2.material = wall3.material = wall4.material = pbr2

        ground.position = new Vector3(25, 0, 0)
        const offset = 25
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                const ground2 = ground.clone()
                ground2.position = new Vector3(i * 50 - offset, 0, j * 50 - offset)
            }
        }
        ground.isVisible = false



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
            this.#scene.render()
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
                    .rotateByQuaternionToRef(this.#camera.rotation.toQuaternion(), Scene1.#DUMMY_VECTOR)
                    .scaleInPlace(Scene1.#WALK_SPEED * timeDelta)
                this.#camera
                    .position
                    .addInPlace(directionalMovement)
            }
        } else {
            // Rotation
            const mousePosX = this.#scene.pointerX
            const mousePosY = this.#scene.pointerY
            const rotSpeed = Scene1.#ROTATION_SPEED * timeDelta;
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
                .rotateByQuaternionToRef(this.#camera.rotation.toQuaternion(), Scene1.#DUMMY_VECTOR)
                .scaleInPlace(Scene1.#WALK_SPEED * timeDelta);
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
                        const rotSpeed = Scene1.#TOUCH_ROTATION_SPEED * timeDelta;
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
        container.onPointerDownObservable.add(coordinates => {
            inner.left = (coordinates.x - container.centerX)
            inner.top  = (coordinates.y - container.centerY)
            this.#isMoveStickDown = true
        })
        container.onPointerMoveObservable.add(coordinates => {
            const left = (coordinates.x - this.#moveStickContainer.centerX)
            const top = (coordinates.y - this.#moveStickContainer.centerY)
            inner.left = left
            inner.top = top
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
