import ChatWithGemini from './components/ChatWithGemini'
import { Container } from '@chakra-ui/react'
import './App.css'

function App() {

  return (
    <Container maxW={'none'} className="App" bgColor={'black'} bgGradient={'linear(to-r, gray.800, blue.700)'} color={'black'}>
      <ChatWithGemini />
    </Container>
  )
}

export default App
