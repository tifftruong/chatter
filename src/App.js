import React, {useState} from 'react'
import './App.css'
import NamePicker from './namePicker.js'

function App() {
  const [messages, setMessages] = useState([])
  const title = 'Chatter'
  const [name, setName] = useState('')
  console.log(messages)
  return <main>

    <header> 
      <div>
        <img className="logo"
          alt="logo"
          src="https://sdl-stickershop.line.naver.jp/products/0/0/1/1292998/android/stickers/11864944.png;compress=true" 
        />
        {title}
      </div>
      <NamePicker onSave={setName}/>
    </header>

    <div className="messages">
      {messages.map((m,i)=>{
        return <div key={i} className="message-wrap">
          <div className="message">{m}</div>
        </div>
      })}
    </div>

    <TextInput onSend={(text)=> {
      setMessages([text, ...messages])
    }} />
    
  </main>
}


function TextInput(props){
  var [text, setText] = useState('') 
  // normal js comment
  return <div className="text-input-wrap">
    <input 
      value={text} 
      className="text-input"
      placeholder="write your message"
      onChange={e=> setText(e.target.value)}
      onKeyPress={e=> {
        if(e.key==='Enter') {
          if(text) props.onSend(text)
          setText('')
        }
      }}
    />
    <button onClick={()=> {
      if(text) props.onSend(text)
      setText('')
    }} className="button"
      disabled={!text}>
      SEND
    </button>
  </div>
}

export default App