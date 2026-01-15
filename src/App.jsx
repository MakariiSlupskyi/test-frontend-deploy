import { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { Send } from 'lucide-react';

function App() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [userName, setUserName] = useState('x0rg')
  const messagesEndRef = useRef()

  useEffect(() => {
    const intervalId = setInterval(() => {
      axios.get(`${import.meta.env.VITE_BACKEND_URL}/messages`)
        .then(resp => {
          setMessages(prev => resp.data.length !== prev.length ? resp.data : prev)
        })
    }, 1000);
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    scrollDown()
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === "") return

    const newMsg = { userName: userName, message: message }
    axios.post(`${import.meta.env.VITE_BACKEND_URL}/messages`, newMsg)
    setMessages([...messages, newMsg])
    setMessage("")
    scrollDown()
  }

  const scrollDown = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

  return (
    <div className='flex justify-center items-stretch h-screen'>
      <div className='flex flex-col md:lg:mt-[20vh] md:lg:w-[30vw] w-full md:lg:h-1/2 h-screen'>
        <div className='ml-2 mb-1'>
          <p className='inline text-neutral-400'>Your name: </p>
          <input
            value={userName}
            onChange={e => setUserName(e.target.value)}
            placeholder='...'
            className='field-sizing-content focus:outline-0 text-sm text-neutral-700 font-medium border-neutral-200 border-b-2'
          />
        </div>
        <div className='flex flex-col flex-1 min-h-0 p-3 items-stretch bg-neutral-100 shadow-inner rounded-t-xl rounded-b-4xl'>
          <MessagesField messages={messages} userName={userName} messagesEndRef={messagesEndRef} />
          <InputForm message={message} setMessage={setMessage} handleSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}


const MessagesField = ({ messages, userName, messagesEndRef }) => {
  return <div className='flex flex-1 flex-col items-start grow overflow-auto no-scrollbar'>
    {messages.map((m, id) => (
      <div key={id} className={`p-1 mb-2 rounded-lg bg-white shadow-sm ${m.userName === userName && "self-end"}`}>
        <p className='px-1'><span className='text-sm text-neutral-400'>{m.userName}:</span> {m.message}</p>
      </div>
    ))}
    <div ref={messagesEndRef} />
  </div>
}


const InputForm = ({ message, setMessage, handleSubmit }) => {
  return <form className='flex gap-2 p-1 rounded-full bg-white shadow-sm' onSubmit={handleSubmit}>
    <input value={message} onChange={e => setMessage(e.target.value)} className='ml-3 grow focus:outline-0' placeholder='Your message...' />
    <button
      className='pt-1 pl-1 w-9 h-9 bg-blue-400 rounded-full text-white'
      type='submit'
    ><Send /></button>
  </form>
}


export default App