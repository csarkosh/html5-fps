import {
    Color3,
    HemisphericLight,
    MeshBuilder,
    PBRMaterial,
    PointerEventTypes,
    Scene,
    Texture,
    UniversalCamera,
    Vector3,
} from '@babylonjs/core'
import {AdvancedDynamicTexture, Control, Ellipse} from "@babylonjs/gui";
import basecolorTxr from './Tiles_012_COLOR.jpg'
import normalDisplacementTxr from './Tiles_012_NRM_DSP.png'
import metallicRoughnessAoTxr from './Tiles_012_OCC_ROUGH_METAL.jpg'
import basecolorTxr2 from './Stylized_Sci-fi_Wall_001_COLOR.jpg'
import normalDisplacementTxr2 from './Stylized_Sci-fi_Wall_001_NRM_DSP.png'
import metallicRoughnessAoTxr2 from './Stylized_Sci-fi_Wall_001_OCC_ROUGH_METAL.jpg'
import basecolorTxr3 from './Ceiling_Gypsum_001_COLOR.jpg'
import normalDisplacementTxr3 from './Ceiling_Gypsum_001_NRM_DSP.png'
import metallicRoughnessAoTxr3 from './Ceiling_Gypsum_001_OCC_ROUGH_METAL.jpg'
import emissiveTxr3 from './Ceiling_Gypsum_001_emissive.jpg'


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
        const camera = new UniversalCamera('user', new Vector3(0, 5, 0), this.#scene)
        camera.setTarget(Vector3.Zero())
        camera.attachControl(canvas, true)
        camera.inputs.remove(camera.inputs.attached.touch)
        camera.rotation = Vector3.Zero()
        this.#camera = camera
        const ground = MeshBuilder.CreateGround('ground', { height: 100, width: 100, subdivisions: 1 })
        ground.position = Vector3.Zero()
        const wall1 = MeshBuilder.CreatePlane('wall1', { height: 15, width: 100 })
        ground.addChild(wall1)
        wall1.position = new Vector3(0, 7.5, 50)
        wall1.rotation = Vector3.Zero()
        const wall2 = MeshBuilder.CreatePlane('wall2', { height: 15, width: 100 })
        ground.addChild(wall2)
        wall2.position = new Vector3(50, 7.5, 0)
        wall2.rotation = new Vector3(0, Math.PI / 2, 0)
        const wall3 = MeshBuilder.CreatePlane('wall3', { height: 15, width: 100 })
        ground.addChild(wall3)
        wall3.position = new Vector3(0, 7.5, -50)
        wall3.rotation = new Vector3(0, Math.PI, 0)
        const wall4 = MeshBuilder.CreatePlane('wall4', { height: 15, width: 100 })
        ground.addChild(wall4)
        wall4.position = new Vector3(-50, 7.5, 0)
        wall4.rotation = new Vector3(0, 3 * Math.PI / 2, 0)
        const ceiling = MeshBuilder.CreatePlane('ceiling', { height: 100, width: 100 })
        ground.addChild(ceiling)
        ceiling.position = new Vector3(0, 15, 0)
        ceiling.rotation = new Vector3(3 * Math.PI / 2, 0, 0)


        const light2 = new HemisphericLight('light2', Vector3.Down(), this.#scene)
        light2.diffuse = Color3.White()
        light2.specular = Color3.White()
        light2.groundColor = Color3.White()
        light2.intensity = 0.7


        const UV_SCALE = 20


        const pbr1 = new PBRMaterial('pbr1', this.#scene)
        pbr1.albedoTexture = new Texture(basecolorTxr, this.#scene)
        pbr1.bumpTexture = new Texture(normalDisplacementTxr, this.#scene)
        pbr1.metallicTexture = new Texture(metallicRoughnessAoTxr, this.#scene)
        pbr1.useRoughnessFromMetallicTextureAlpha = false
        pbr1.useMetallnessFromMetallicTextureBlue = true
        pbr1.useRoughnessFromMetallicTextureGreen = true
        pbr1.useAmbientOcclusionFromMetallicTextureRed = true
        pbr1.albedoTexture.uScale = UV_SCALE
        pbr1.albedoTexture.vScale = UV_SCALE
        pbr1.bumpTexture.uScale = UV_SCALE
        pbr1.bumpTexture.vScale = UV_SCALE
        pbr1.metallicTexture.uScale = UV_SCALE
        pbr1.metallicTexture.vScale = UV_SCALE
        pbr1.useRoughnessFromMetallicTextureAlpha = false
        pbr1.useMetallnessFromMetallicTextureBlue = true
        pbr1.useRoughnessFromMetallicTextureGreen = true
        pbr1.useAmbientOcclusionFromMetallicTextureRed = true
        pbr1.useParallax = true
        pbr1.parallaxScaleBias = 0.01

        const pbr2 = new PBRMaterial('pbr2', this.#scene)
        pbr2.albedoTexture = new Texture(basecolorTxr2, this.#scene)
        pbr2.bumpTexture = new Texture(normalDisplacementTxr2, this.#scene)
        pbr2.metallicTexture = new Texture(metallicRoughnessAoTxr2, this.#scene)
        pbr2.useRoughnessFromMetallicTextureAlpha = false
        pbr2.useMetallnessFromMetallicTextureBlue = true
        pbr2.useRoughnessFromMetallicTextureGreen = true
        pbr2.useAmbientOcclusionFromMetallicTextureRed = true
        pbr2.albedoTexture.uScale = UV_SCALE
        pbr2.bumpTexture.uScale = UV_SCALE
        pbr2.metallicTexture.uScale = UV_SCALE
        pbr2.useRoughnessFromMetallicTextureAlpha = false
        pbr2.useMetallnessFromMetallicTextureBlue = true
        pbr2.useRoughnessFromMetallicTextureGreen = true
        pbr2.useAmbientOcclusionFromMetallicTextureRed = true
        pbr2.useParallax = true
        pbr2.parallaxScaleBias = 0.1

        const pbr3 = new PBRMaterial('pbr3', this.#scene)
        pbr3.albedoTexture = new Texture(basecolorTxr3, this.#scene)
        pbr3.bumpTexture = new Texture(normalDisplacementTxr3, this.#scene)
        pbr3.metallicTexture = new Texture(metallicRoughnessAoTxr3, this.#scene)
        pbr3.emissiveTexture = new Texture(emissiveTxr3, this.#scene)
        pbr3.useRoughnessFromMetallicTextureAlpha = false
        pbr3.useMetallnessFromMetallicTextureBlue = true
        pbr3.useRoughnessFromMetallicTextureGreen = true
        pbr3.useAmbientOcclusionFromMetallicTextureRed = true
        pbr3.albedoTexture.uScale = 5
        pbr3.albedoTexture.vScale = 5
        pbr3.bumpTexture.uScale = 5
        pbr3.bumpTexture.vScale = 5
        pbr3.metallicTexture.uScale = 5
        pbr3.metallicTexture.vScale = 5
        pbr3.emissiveTexture.uScale = 5
        pbr3.emissiveTexture.vScale = 5
        pbr3.useRoughnessFromMetallicTextureAlpha = false
        pbr3.useMetallnessFromMetallicTextureBlue = true
        pbr3.useRoughnessFromMetallicTextureGreen = true
        pbr3.useAmbientOcclusionFromMetallicTextureRed = true
        pbr3.useParallax = true
        pbr3.parallaxScaleBias = 0.025
        pbr3.emissiveColor = Color3.White()
        pbr3.emissiveIntensity = 1


        ground.material = pbr1
        wall1.material = wall2.material = wall3.material = wall4.material = pbr2
        ceiling.material = pbr3


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
