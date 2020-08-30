import React from "react";
import { Engine } from '@babylonjs/core'
import GameScene from './scenes/GameScene'

export default class Game extends React.Component {
    /** @type {React.Ref} */
    #canvas = React.createRef()
    /** @type {Engine} */
    engine = null
    /** @type {GameScene} */
    game = null

    state = {
        isPlaying: false,
        playButtonText: 'Play'
    }

    componentDidMount() {
        this.props.onMount && this.props.onMount()
        window.addEventListener('resize', this.onResize, { passive: true })
        document.addEventListener('pointerlockchange', this.onPointerLockChange)
        document.querySelector('body').style.overflow = 'hidden'
        this.onResize()
        this.engine = new Engine(this.#canvas.current)
        this.game = new GameScene()
        this.game.init(this.#canvas.current, this.engine)
        this.engine.runRenderLoop(() => {
            this.game.update()
        })
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize)
        document.removeEventListener('pointerlockchange', this.onPointerLockChange)
        document.querySelector('body').style.overflow = 'auto'
    }

    onPointerLockChange = () => {
        const supportsPointerLock = (
            this.#canvas.current.requestPointerLock
            || this.#canvas.current.mozRequestPointerLock
        )
        const pointerLocked = document.pointerLockElement || document.mozPointerLockElement;
        if (supportsPointerLock && !pointerLocked) {
           this.game.pause()
           this.setState({ isPlaying: false })
        }
    }

    onResize = e => {
        e && e.preventDefault()
        this.#canvas.current.style.height = `${window.innerHeight}px`
    }

    onPlay = () => {
        this.engine.enterPointerlock()
        this.game.play()
        this.setState({
            isPlaying: true,
            playButtonText: 'Resume'
        })
    }

    onPlayTouch = () => this.game.setTouchDevice(true)

    render() {
        return (
            <div className="overlay-container">
                <div style={{ zIndex: this.state.isPlaying ? -1 : 1 }}>
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
                    ref={this.#canvas}
                    width={1280}
                />
            </div>
        )
    }
}
