import { PhoneFrame } from './PhoneFrame'
import { SignIn } from './screens/SignIn'

function App() {
  return (
    <PhoneFrame>
      <SignIn onSignIn={() => undefined} />
    </PhoneFrame>
  )
}

export default App
