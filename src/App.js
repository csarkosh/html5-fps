import React from 'react'
const Game = React.lazy(() => import('./Game'))

function App(props) {
    return (
        <React.Fragment>
            <React.Suspense fallback={<span>Loading...</span>}>
                <Game />
            </React.Suspense>
        </React.Fragment>
    )
}

export default App
