import React from 'react'
import {withStyles} from "@material-ui/core"
import { AppBar, Button, IconButton, Menu, MenuItem } from '@material-ui/core'
import { Launch, Fullscreen, MoreVert } from '@material-ui/icons'
import * as B from '@babylonjs/core'
import * as M from '@babylonjs/materials'
import ProgramButton from "./ProgramButton";
import CanvasSettingsButton from "./CanvasSettingsButton";
import VideoSettings from "./VideoSettings";

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
        },
        '& > div:last-child': {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: 700,
        }
    },
    canvas: {
        maxWidth: 640,
        maxHeight: 480,
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
    buttonWrapper: {
        marginTop: 8,
        '& > button + button': {
            marginLeft: 24,
        },
    },
})


class App extends React.Component {
    /** @type {React.RefObject} */
    canvas = React.createRef()
    /** @type {Engine} */
    engine = null

    state = {
        settingsAnchorEl: null,
        res: '640x480',
        resAnchorEl: null,
    }

    componentDidMount() {
        this.engine = new B.Engine(this.canvas.current)
        const scene = new B.Scene(this.engine)
        const camera = new B.FreeCamera('camera1', new B.Vector3(0, 5, -10), scene)
        camera.setTarget(new B.Vector3.Zero())
        camera.attachControl(this.canvas.current, true)
        const light = new B.HemisphericLight('light1', new B.Vector3(0, 1, 0), scene)
        light.intensity = 0.7
        const material = new M.GridMaterial('grid', scene)
        const sphere = B.Mesh.CreateSphere('sphere1', 16, 2, scene)
        sphere.position.y = 2
        sphere.material = material
        this.engine.runRenderLoop(() => scene.render())
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
        const [width, height] = this.state.res.split('x')
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
                                height={height}
                                width={width}
                                className={classes.canvas}
                                ref={this.canvas}
                                id="glcanvas"
                            >
                            </canvas>
                        </div>
                    </div>
                    <div className={classes.buttonWrapper}>
                        <CanvasSettingsButton
                            icon={<Fullscreen color="inherit" fontSize="large" />}
                            label="Fullscreen"
                            onClick={this.enterFullscreen}
                        />
                        <CanvasSettingsButton
                            icon={<VideoSettings color="inherit" fontSize="large" />}
                            label="Resolution"
                            onClick={this.resOpen}
                        />
                        <Menu
                            anchorEl={this.state.resAnchorEl}
                            keepMounted
                            onClose={this.resClose}
                            open={Boolean(this.state.resAnchorEl)}
                        >
                            <MenuItem component="button" onClick={this.setRes} value="640x480">480p</MenuItem>
                            <MenuItem component="button" onClick={this.setRes} value="1280x720">720p</MenuItem>
                            <MenuItem component="button" onClick={this.setRes} value="1920x1080">1080p</MenuItem>
                            <MenuItem component="button" onClick={this.setRes} value="2560x1440">1440p</MenuItem>
                            <MenuItem component="button" onClick={this.setRes} value="3840x2160">2160p</MenuItem>
                        </Menu>
                    </div>
                    <div>
                        {[].map(({ name, program }) => (
                            <ProgramButton
                                active={this.state.active === name}
                                key={name}
                                onClick={this.startProgram(name, program)}
                            >
                                {name}
                            </ProgramButton>
                        ))}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}


export default withStyles(styles, { withTheme: true })(App)
