import GUIFactory from "./GUIFactory";
import {PointerEventTypes, PointerInfo, Scene, UniversalCamera, Vector2} from "@babylonjs/core";
import {Vector3} from "@babylonjs/core/Maths/math.vector";
import {AdvancedDynamicTexture, Control} from "@babylonjs/gui";
import IControls from "./IControls";

export default class TouchControls implements IControls {
    private camera: UniversalCamera = null

    /**
     * The outer ellipse of the joystick
     */
    private container: Control = null

    private directionRet: Vector3 = Vector3.Zero()

    /**
     * The inner ellipse of the joystick
     */
    private inner: Control = null

    private isJoystickDown: boolean = false

    /**
     * Next touch position
     */
    private nextPos: Vector2 = null

    /**
     * Previous touch position
     */
    private prevPos: Vector2 = null

    private screenPointerId: number = -1

    /**
     * Memoized instance for returning rotation data (prevents
     * repeated instantiation in render loop)
     *
     * **WARNING**: Unsafe to read from internally
     */
    private rotationRet: Vector2 = Vector2.Zero()

    private scene: Scene = null

    private ui: AdvancedDynamicTexture = null

    public constructor(camera: UniversalCamera, ui: AdvancedDynamicTexture) {
        const scene = camera.getScene()
        this.camera = camera
        this.scene = scene
        this.ui = ui
        const {container, inner} = GUIFactory.createVirtualJoystick(ui)
        this.container = container
        this.inner = inner
        this.container.onPointerDownObservable.add(this.onJoystickPointerDown)
        this.container.onPointerMoveObservable.add(this.onJoystickPointerDown)
        this.container.onPointerUpObservable.add(this.onJoystickPointerUp)
        this.scene.onPointerObservable.add(this.onScenePointerObservable)
    }

    public destroy = (): void => {
        this.inner.dispose()
        this.container.dispose()
        this.scene.onPointerObservable.removeCallback(this.onScenePointerObservable)
    }

    public direction = (): Vector3 => {
        const dir = this.directionRet
        dir.setAll(0)
        if (this.isJoystickDown) {
            dir.x = this.inner.leftInPixels
            dir.z = -1 * this.inner.topInPixels
            dir.normalize()
        }
        return dir
    }

    public isJumping = (): boolean => {
        return false
    }

    public isRunning = (): boolean => {
        return false
    }


    public rotation = (): Vector2 => {
        if (this.nextPos) {
            const deltaX = this.nextPos.x - this.prevPos.x;
            const deltaY = this.nextPos.y - this.prevPos.y;
            this.prevPos.set(this.nextPos.x, this.nextPos.y)
            this.rotationRet.set(deltaY, deltaX)
        }
        return this.rotationRet
    }

    private onScenePointerObservable = (info: PointerInfo): void => {
        // @ts-ignore Babylonjs bug
        const pointerId = info.event.pointerId;
        const type = info.type;
        if (type === PointerEventTypes.POINTERDOWN && this.screenPointerId === -1) {
            this.screenPointerId = pointerId
            this.prevPos = new Vector2(this.scene.pointerX, this.scene.pointerY)
            this.nextPos = this.prevPos.clone()
        }
        if (this.screenPointerId === pointerId) {
            if (type === PointerEventTypes.POINTERUP) {
                this.screenPointerId = -1
                this.rotationRet.set(0, 0)
            } else if (type === PointerEventTypes.POINTERMOVE) {
                const { clientX, clientY } = info.event
                this.nextPos.set(clientX, clientY)
            }
        } else if (type === PointerEventTypes.POINTERMOVE && this.isJoystickDown) {
            // Clamp and update joystick inner when pointer is moved off joystick
            // container w/o lifting pointer
            const { clientX, clientY } = info.event
            const left = (clientX - this.container.centerX)
            const top = (clientY - this.container.centerY)
            const magnitude = Math.sqrt(left ** 2 + top ** 2)
            const radius = this.container.widthInPixels/ 2
            this.inner.left = radius * left / magnitude
            this.inner.top = radius * top / magnitude
        }
    }

    private onJoystickPointerDown = (coordinates: Vector2): void => {
        this.inner.left = coordinates.x - this.container.centerX
        this.inner.top = coordinates.y - this.container.centerY
        this.isJoystickDown = true
    }

    private onJoystickPointerUp = (): void => {
        this.inner.left = this.inner.top = 0
        this.isJoystickDown = false
    }
}
