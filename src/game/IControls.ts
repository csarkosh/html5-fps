import {Vector2, Vector3} from "@babylonjs/core";

export default interface IControls {
    destroy(): void
    /**
     * Returns the intended movement direction
     */
    direction(): Vector3
    rotation(): Vector2
}
