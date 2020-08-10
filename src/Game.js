import React from "react";
import {
    Engine,
    HemisphericLight,
    Mesh,
    MeshBuilder,
    Scene,
    UniversalCamera,
    Vector3
} from '@babylonjs/core'

const DUMMY_VECTOR = Vector3.Zero()
const WALK_SPEED = 13
const ROTATION_SPEED = 1 / 50

/**
 * Translate camera position relative to its rotation
 *
 * @param {UniversalCamera} camera
 * @param {number} deltaTime
 * @param {Vector3} direction
 * @return {Vector3}
 */
const translateCamPos = (camera, deltaTime, direction) => camera.position.addInPlace(
    direction
        .rotateByQuaternionToRef(camera.rotation.toQuaternion(), DUMMY_VECTOR)
        .scaleInPlace(WALK_SPEED * deltaTime))

class Game extends React.Component {
    /** @type {React.Ref} */
    canvas = React.createRef()
    /** @type {Engine} */
    engine = null
    /** @type {Object.<String, Boolean>} */
    keysDown = {}

    state = {
        playButtonText: 'Play'
    }

    componentDidMount() {
        window.document.addEventListener(
            'keydown',
            e => this.keysDown[e.key] = true,
            { passive: true }
        )
        window.document.addEventListener(
            'keyup',
            e => delete this.keysDown[e.key],
            { passive: true }
        )

        this.engine = new Engine(this.canvas.current)
        const scene = new Scene(this.engine)
        const camera = new UniversalCamera('user', new Vector3(0, 5, -10), scene)
        camera.setTarget(Vector3.Zero())
        camera.attachControl(this.canvas.current, true)
        camera.inertia = 0
        camera.rotation = Vector3.Zero()
        const light = new HemisphericLight('light1', Vector3.Up(), scene)
        light.intensity = 0.7
        const sphere = Mesh.CreateSphere('sphere1', 16, 2, scene)
        sphere.position.y = 2
        MeshBuilder.CreateGround('ground', { height: 15, width: 15, subdivisions: 2 })

        let prevMousePosX = null
        let prevMousePosY = null
        scene.render()
        this.engine.runRenderLoop(() => {
            if (!this.engine.isFullscreen) {
                prevMousePosX = prevMousePosY = 0
                return
            } else if (prevMousePosX === null) {
                prevMousePosX = scene.pointerX
                prevMousePosY = scene.pointerY
                return
            }

            // Update movement & rotation
            const mousePosX = scene.pointerX
            const mousePosY = scene.pointerY
            const deltaTime = this.engine.getDeltaTime() / 1000
            camera.position.y = 5
            camera.rotation.x += ROTATION_SPEED * deltaTime * (mousePosX - prevMousePosX)
            camera.rotation.y += ROTATION_SPEED * deltaTime * (mousePosY - prevMousePosY)
            if (this.keysDown.w) {
                translateCamPos(camera, deltaTime, Vector3.Forward())
            }
            if (this.keysDown.a) {
                translateCamPos(camera, deltaTime, Vector3.Left())
            }
            if (this.keysDown.s) {
                translateCamPos(camera, deltaTime, Vector3.Backward())
            }
            if (this.keysDown.d) {
                translateCamPos(camera, deltaTime, Vector3.Right())
            }

            scene.render()
            prevMousePosX = mousePosX
            prevMousePosY = mousePosY
        })
    }

    onPlay = e => {
        this.engine.enterFullscreen(true)
        this.setState({ playButtonText: 'Resume' })
    }

    render() {
        return (
            <div className="overlay-container">
                <div>
                    <button
                        className="btn btn-primary btn-xl"
                        onClick={this.onPlay}
                        onTouchEnd={this.onPlay}
                    >
                        {this.state.playButtonText}
                    </button>
                    <button
                        className="btn btn-primary btn-xl"
                    >
                        Options
                    </button>
                </div>
                <canvas
                    height={720}
                    ref={this.canvas}
                    width={1280}
                />
            </div>
        )
    }
}

export default Game
