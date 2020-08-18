import React from 'react'
import VideoPreviewer from "./VideoPreviewer";
import Glance from "./Glance";
import GameLauncher from "./GameLauncher";
import Categories from "./Categories";
import LinearProgress from './LinearProgress'

const Game = React.lazy(() => import('./Game'))

class Loader extends React.Component {
    static defaultProps = { onStart: () => {}, onDone: () => {} }
    componentDidMount = () => this.props.onStart()
    componentWillUnmount = () => this.props.onDone()
    render = () => <React.Fragment />
}

function App() {
    const [status, setStatus] = React.useState()

    return (
        <React.Fragment>
            {status !== 'loaded' && (
                <React.Fragment>
                    <header className="navbar">
                        <section className="navbar-section">
                            <a href="/" className="navbar-brand mr-2 text-primary">
                                3D Web Game
                            </a>
                        </section>
                        <LinearProgress style={{ opacity: status === 'loading' ? 1 : 0 }}/>
                    </header>
                    <div className="store-wrapper">
                        <div className="store-group">
                            <VideoPreviewer />
                            <Glance />
                        </div>
                        <div className="store-group">
                            <GameLauncher
                                onBrowserLaunch={() => setStatus('loading')}
                                onInstall={() => {}}
                            />
                            <Categories />
                        </div>
                    </div>
                </React.Fragment>
            )}
            {(status === 'loading' || status === 'loaded') && (
                <React.Suspense
                    fallback={
                        <Loader onDone={() => {
                            console.log('hello')
                            setStatus('loaded')
                        }} />
                    }
                >
                    <Game />
                </React.Suspense>
            )}
        </React.Fragment>
    )
}

export default App
