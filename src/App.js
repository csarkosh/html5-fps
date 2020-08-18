import React from 'react'
import VideoPreviewer from "./VideoPreviewer";
import Glance from "./Glance";
import GameLauncher from "./GameLauncher";
import Categories from "./Categories";
import LinearProgress from './LinearProgress'
const Game = React.lazy(() => import('./Game'))

/**
 * @param {object.<string, *>} state
 * @param {function} setState
 * @return {function}
 */
const popStateHandler = (state, setState) => () => setState({ ...state, pathname: window.location.pathname })

const gameMountHandler = (state, setState) => () => {
    setState({ ...state, loading: false })
    window.history.pushState(null, null, '/game')
}

let listenersSet = false

function App() {
    const [state, setState] = React.useState({
        pathname: window.document.location.pathname,
        loading: false,
    })
    React.useEffect(() => {
        if (!listenersSet) {
            listenersSet = true
            window.addEventListener('popstate', popStateHandler(state, setState), {passive: true})
        }
    }, [state, setState])
    return (
        <React.Fragment>
            {(state.pathname !== '/game' || state.loading) && (
                <React.Fragment>
                    <header className="navbar">
                        <section className="navbar-section">
                            <a href="/" className="navbar-brand mr-2 text-primary">
                                3D Web Game
                            </a>
                        </section>
                        <LinearProgress style={{ opacity: state.loading ? 1 : 0 }}/>
                    </header>
                    <div className="store-wrapper">
                        <div className="store-group">
                            <VideoPreviewer />
                            <Glance />
                        </div>
                        <div className="store-group h-safe-inset">
                            <GameLauncher
                                onBrowserLaunch={() => {
                                    setState({ ...state, pathname: '/game', loading: true })
                                }}
                                onInstall={() => {}}
                            />
                            <Categories />
                        </div>
                    </div>
                </React.Fragment>
            )}
            {state.pathname === '/game' && (
                <React.Suspense fallback={<React.Fragment />}>
                    <Game onMount={gameMountHandler(state, setState)} />
                </React.Suspense>
            )}
        </React.Fragment>
    )
}

export default App
