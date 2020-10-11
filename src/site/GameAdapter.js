import React from "react";
import { Engine } from '@babylonjs/core'
import Scene1 from '../game/Scene1.ts'

export default class GameAdapter extends React.Component {
    /** @type {React.Ref} */
    #canvas = React.createRef()
    /** @type {Engine} */
    engine = null
    /** @type {Scene1} */
    game = null

    state = {
        playDisabled: false,
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
        this.game = new Scene1()
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
        /** @type HTMLCanvasElement */
        const canvasEl = this.#canvas.current
        const supportsPointerLock = (
            canvasEl.requestPointerLock
            || canvasEl.mozRequestPointerLock
            || canvasEl.webkitRequestPointerLock
        )
        const pointerLocked = document.pointerLockElement
            || document.mozPointerLockElement
            || document.webkitPointerLockElement;
        if (supportsPointerLock && !pointerLocked) {
           this.game.pause()
           this.setState({ isPlaying: false, playDisabled: true })
            window.setTimeout(() => this.setState({ playDisabled: false }), 2000)
        }
    }

    onResize = e => {
        e && e.preventDefault()
        this.engine && this.engine.resize()
        this.#canvas.current.style.height = `${window.innerHeight}px`
    }

    /**
     * @param {MouseEvent<HTMLButtonElement>} e
     */
    onPlay = (e) => {
        this.engine.enterPointerlock()
        this.game.play()
        e.target.blur()
        e.stopPropagation()
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
                        disabled={this.state.playDisabled}
                        onClick={this.onPlay}
                        onTouchStart={this.onPlayTouch}
                    >
                        {this.state.playButtonText}
                    </button>
                    <button className="btn btn-primary btn-xl">
                        Settings
                    </button>
                </div>
                <canvas
                    height={720}
                    id="game"
                    ref={this.#canvas}
                    width={1280}
                />
            </div>
        )
    }
}
