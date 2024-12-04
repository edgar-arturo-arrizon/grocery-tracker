import './App.css'
import { useEffect } from 'react'

export default function App() {

  // establish connection to express server
  async function test() {
    const url = 'http://localhost:3000/'
    const response = await fetch(url);
    console.log(response)
  }

  useEffect(() => {
    test()
  }, [])

  return (
    <h1>
      Hello world!
    </h1>
  )
}
