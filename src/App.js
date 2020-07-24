import React from 'react'
import {withStyles} from "@material-ui/core"
import { AppBar, Button, IconButton, Menu, MenuItem } from '@material-ui/core'
import { Launch, MoreVert } from '@material-ui/icons'
import * as B from '@babylonjs/core'

const APP_BAR_HEIGHT = '48px'

const styles = theme => ({
    appBarRoot: {
        height: APP_BAR_HEIGHT,
        padding: '6px 8px',
        '& > div': {
            display: 'flex',
            justifyContent: 'space-between',
        },
    },
    titleButtonRoot: {
        padding: '0 6px',
    },
    titleButtonLabel: {
        color: 'white',
        fontSize: 21,
        fontWeight: 600,
        textTransform: 'none',
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 48,
        '& > div:first-child': {
            backgroundColor: 'black',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
        }
    },
    canvas: {
        maxWidth: 1280,
        maxHeight: 720,
        width: '100%',
        '&:focus': {
            outline: 'none',
        }
    },
    settingsButton: {
        color: 'white',
        marginRight: 8,
        padding: 6,
        '& svg': {
            fontSize: 28,
        }
    },
})

class App extends React.Component {
    /** @type {React.RefObject} */
    canvas = React.createRef()
    /** @type {Engine} */
    engine = null

    keysDown = {}

    state = {
        settingsAnchorEl: null,
        resAnchorEl: null,
    }

    componentDidMount() {
        this.engine = new B.Engine(this.canvas.current)
        const scene = new B.Scene(this.engine)
        const camera = new B.UniversalCamera('camera1', new B.Vector3(0, 5, -10), scene)
        camera.setTarget(new B.Vector3.Zero())
        camera.attachControl(this.canvas.current, true)
        camera.keysUp.push(87)
        camera.keysDown.push(83)
        camera.keysLeft.push(65)
        camera.keysRight.push(68)
        camera.speed = 0.4
        console.log(camera.speed)
        const light = new B.HemisphericLight('light1', new B.Vector3(0, 1, 0), scene)
        light.intensity = 0.7
        const sphere = B.Mesh.CreateSphere('sphere1', 16, 2, scene)
        sphere.position.y = 2
        B.MeshBuilder.CreateGround('ground', { height: 15, width: 15, subdivisions: 2 })
        window.document.onkeydown = e => {
            this.keysDown[e.key] = true
        }
        window.document.onkeyup = e => {
            delete this.keysDown[e.key]
        }
        this.engine.runRenderLoop(() => {
            camera.position.y = 5
            scene.render()
        })
    }

    componentWillUnmount() {
        window.document.onkeydown = undefined
        window.document.onkeyup = undefined
    }

    enterFullscreen = () => {
        if (!this.engine) return;
        this.engine.enterFullscreen()
    }

    resClose = () => this.setState({ resAnchorEl: null })

    resOpen = e => this.setState({ resAnchorEl: e.currentTarget })

    setRes = e => this.setState({ res: e.target.value, resAnchorEl: null })

    settingsClose = () => this.setState({ settingsAnchorEl: null })

    settingsOpen = e => this.setState({ settingsAnchorEl: e.currentTarget })

    render() {
        const { classes } = this.props
        return (
            <React.Fragment>
                <AppBar
                    classes={{ root: classes.appBarRoot }}
                    color="primary"
                    position="fixed"
                >
                    <div>
                        <Button
                            classes={{
                                root: classes.titleButtonRoot,
                                label: classes.titleButtonLabel,
                            }}
                            component="a"
                            href="/"
                        >
                            webgl.csarko.sh
                        </Button>
                        <IconButton
                            aria-label="Link to source code"
                            classes={{ root: classes.settingsButton }}
                            onClick={this.settingsOpen}
                        >
                            <MoreVert />
                        </IconButton>
                        <Menu
                            anchorEl={this.state.settingsAnchorEl}
                            keepMounted
                            onClose={this.settingsClose}
                            open={Boolean(this.state.settingsAnchorEl)}
                        >
                            <MenuItem
                                component="a"
                                href="https://github.com/csarkosh/webgl-react"
                                rel="noopener"
                                target="_blank"
                            >
                                Source Code <Launch />
                            </MenuItem>
                        </Menu>
                    </div>
                </AppBar>
                <div className={classes.body}>
                    <div>
                        <div className={classes.canvasWrapper}>
                            <canvas
                                height={720}
                                width={1280}
                                className={classes.canvas}
                                ref={this.canvas}
                                id="glcanvas"
                            >
                            </canvas>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}


export default withStyles(styles, { withTheme: true })(App)
