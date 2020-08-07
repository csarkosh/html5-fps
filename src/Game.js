import React from "react";
import {Engine, HemisphericLight, Mesh, MeshBuilder, Scene, UniversalCamera, Vector3} from '@babylonjs/core'
import {FaPlay} from "react-icons/fa";

class Game extends React.Component {
    /** @type {React.Ref} */
    canvas = React.createRef()
    /** @type {Engine} */
    engine = null
    /** @type {Object.<String, Boolean>} */
    keysDown = {}

    state = {
        showPlayButton: true
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
        const light = new HemisphericLight('light1', Vector3.Up(), scene)
        light.intensity = 0.7
        const sphere = Mesh.CreateSphere('sphere1', 16, 2, scene)
        sphere.position.y = 2
        MeshBuilder.CreateGround('ground', { height: 15, width: 15, subdivisions: 2 })
        this.engine.runRenderLoop(() => {
            if (this.engine.isPointerLock && !this.state.showPlayButton) {
                this.setState({ showPlayButton: true })
            }
            camera.position.y = 5
            scene.render()
        })
    }

    onPlay = e => {
        this.engine.enterFullscreen(true)
        this.setState({ showPlayButton: false })
    }

    render() {
        return (
            <div className="overlay-container">
                {this.state.showPlayButton && (
                    <div>
                        <button
                            className="btn btn-primary btn-action btn-xl s-circle"
                            onClick={this.onPlay}
                            onTouchEnd={this.onPlay}
                        >
                            <FaPlay className="svg-xl" />
                        </button>
                    </div>
                )}
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
