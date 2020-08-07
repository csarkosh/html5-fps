import React from 'react'
const Game = React.lazy(() => import('./Game'))

function App(props) {
    //const [installed, setInstalled] = React.useState(false)

    //React.useEffect(() => {
    //    if (navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
    //        setInstalled(true)
    //    }
    //}, [])

    return (
        <React.Fragment>
            <React.Suspense fallback={<span>Loading...</span>}>
                <Game />
            </React.Suspense>
        </React.Fragment>
    )
}

export default App
