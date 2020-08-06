import React from "react";
import {Engine, HemisphericLight, Mesh, MeshBuilder, Scene, UniversalCamera, Vector3} from '@babylonjs/core'

class Game extends React.Component {
    /** @type {React.Ref} */
    canvas = React.createRef()
    /** @type {Engine} */
    engine = null
    /** @type {Object.<String, Boolean>} */
    keysDown = {}

    componentDidMount() {
        window.document.onkeydown = e => {
            this.keysDown[e.key] = true
        }
        window.document.onkeydown = e => {
            delete this.keysDown[e.key]
        }

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
            camera.position.y = 5
            scene.render()
        })
    }

    render() {
        return (
            <canvas
                height={720}
                ref={this.canvas}
                width={1280}
            />
        )
    }
}

export default Game
