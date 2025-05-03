import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Prompt() {
  const navigate = useNavigate()
  const handleMessage = (request: any) => {
    console.log('react received message', request)
    if (request.target === 'check-image') {
      navigate('/prompt')
    }
  }
  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'TEST_ACTION' }).then((res) => {
      console.log(res)
    })
    chrome.runtime.onMessage.addListener(handleMessage)
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [])

  return <></>
}
