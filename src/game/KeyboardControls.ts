import {Scene, UniversalCamera, Vector2, Vector3} from "@babylonjs/core";
import IControls from "./IControls";

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

    public constructor(camera: UniversalCamera) {
        const scene = camera.getScene()
        this.camera = camera
        this.prevPos = new Vector2(scene.pointerX, scene.pointerY)
        this.scene = scene
        window.addEventListener('keydown', this.onKeyDown)
        window.addEventListener('keyup', this.onKeyUp)
    }

    public destroy = (): void => {
        window.removeEventListener('keydown', this.onKeyDown)
        window.removeEventListener('keyup', this.onKeyUp)
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

    public rotation = (): Vector2 => {
        // Stubbed method
        return KeyboardControls.ROTATION_STUB
    }

    private onKeyDown = (e: KeyboardEvent): void => {
        this.keysDown[e.code] = true
    }

    private onKeyUp = (e: KeyboardEvent): void => {
        this.keysDown[e.code] = false
    }
}
