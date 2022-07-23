import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { Activity, CallDetails } from './components'

const App = () => {
  return (
    <div>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={ <Activity/> } />
                <Route path='/:callID' element={ <CallDetails/> } />
            </Routes>
        </BrowserRouter>
    </div>
  )
}

export default App