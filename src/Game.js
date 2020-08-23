import React from "react";
import { Engine } from '@babylonjs/core'
import GameScene from './scenes/Game'

class Game extends React.Component {
    /** @type {React.Ref} */
    #canvas = React.createRef()
    /** @type {Engine} */
    engine = null
    /** @type {GameScene} */
    game = null

    state = {
        playButtonText: 'Play'
    }

    componentDidMount() {
        this.props.onMount && this.props.onMount()
        window.document.querySelector('body').style.overflow = 'hidden'
        this.engine = new Engine(this.#canvas.current)
        this.game = new GameScene()
        this.game.init(this.#canvas.current, this.engine)
        this.engine.runRenderLoop(() => {
            this.game.update()
        })
    }

    componentWillUnmount() {
        window.document.querySelector('body').style.overflow = 'auto'
    }

    onPlay = e => {
        this.engine.enterFullscreen(true)
        this.engine.enterPointerlock()
        this.setState({ playButtonText: 'Resume' })
    }

    onPlayTouch = () => this.game.setTouchDevice(true)

    render() {
        return (
            <div className="overlay-container">
                <div>
                    <button
                        className="btn btn-primary btn-xl"
                        onClick={this.onPlay}
                        onTouchStart={this.onPlayTouch}
                    >
                        {this.state.playButtonText}
                    </button>
                    <button
                        className="btn btn-primary btn-xl"
                    >
                        Settings
                    </button>
                </div>
                <canvas
                    height={720}
                    onClick={() => window.document.querySelector('canvas').requestPointerLock()}
                    ref={this.#canvas}
                    width={1280}
                />
            </div>
        )
    }
}

export default Game
