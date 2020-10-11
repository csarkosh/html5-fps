import {Scene, UniversalCamera, Vector2, Vector3} from "@babylonjs/core";
import IControls from "./IControls";
import {AdvancedDynamicTexture, Control} from "@babylonjs/gui";
import GUIFactory from "./GUIFactory";

interface IKeysDownMap { [key: string]: boolean }

export default class KeyboardControls implements IControls {
    private static ROTATION_STUB: Vector2 = Vector2.Zero()

    private camera: UniversalCamera = null

    private keysDown: IKeysDownMap = {}

    /**
     * Previous mouse position
     */
    private prevPos: Vector2 = null

    private scene: Scene = null

    private readonly ui: AdvancedDynamicTexture

    private crosshairControls: Control[]

    private firing: boolean = false

    public constructor(camera: UniversalCamera, ui: AdvancedDynamicTexture) {
        const scene = camera.getScene()
        this.camera = camera
        this.prevPos = new Vector2(scene.pointerX, scene.pointerY)
        this.scene = scene
        this.ui = ui
        this.crosshairControls = GUIFactory.createCrosshair(ui)
        window.addEventListener('keydown', this.onKeyDown)
        window.addEventListener('keyup', this.onKeyUp)
        window.addEventListener('click', this.onClick)
    }

    public destroy = (): void => {
        this.crosshairControls.forEach(control => control.dispose())
        window.removeEventListener('keydown', this.onKeyDown)
        window.removeEventListener('keyup', this.onKeyUp)
        window.removeEventListener('click', this.onClick)
    }

    public direction = (): Vector3 => {
        const dir = Vector3.Zero()
        if (this.keysDown.KeyW) {
            dir.z = 1
        }
        if (this.keysDown.KeyA) {
            dir.x = -1
        }
        if (this.keysDown.KeyS) {
            dir.z = -1
        }
        if (this.keysDown.KeyD) {
            dir.x = 1
        }
        dir.normalize()
        return dir
    }

    public isRunning = (): boolean => {
        return Boolean(this.keysDown.ShiftLeft || this.keysDown.ShiftRight)
    }

    public isFiring(): boolean {
        const ret = this.firing
        this.firing = false
        return ret
    }

    public rotation = (): Vector2 => {
        // Stubbed method
        return KeyboardControls.ROTATION_STUB
    }

    private onClick = (): void => {
        this.firing = true
    }

    private onKeyDown = (e: KeyboardEvent): void => {
        this.keysDown[e.code] = true
    }

    private onKeyUp = (e: KeyboardEvent): void => {
        this.keysDown[e.code] = false
    }
}
