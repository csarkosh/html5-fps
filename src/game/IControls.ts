import {Vector2, Vector3} from "@babylonjs/core";

export default interface IControls {
    /**
     * Cleans up internal bindings
     */
    destroy(): void

    /**
     * Returns the intended movement direction
     */
    direction(): Vector3

    isFiring(): boolean

    isRunning(): boolean

    /**
     * Returns a rotation relative to the rotation
     * of the previous frame
     */
    rotation(): Vector2
}
