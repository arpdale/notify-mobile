import { useState } from 'react'
import { PhoneFrame } from './PhoneFrame'
import { SignIn } from './screens/SignIn'
import { Dashboard } from './screens/Dashboard'

type Route = 'sign-in' | 'dashboard'

function App() {
  const [route, setRoute] = useState<Route>('sign-in')

  return (
    <PhoneFrame>
      {route === 'sign-in' && <SignIn onSignIn={() => setRoute('dashboard')} />}
      {route === 'dashboard' && <Dashboard />}
    </PhoneFrame>
  )
}

export default App
