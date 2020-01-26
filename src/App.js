import React, {useState, useEffect} from 'react'
import './App.css'
import {db, useDB} from './db'
import NamePicker from './namePicker.js'
import {BrowserRouter, Route} from 'react-router-dom'

function App() {
  useEffect(()=>{
    const {pathname} = window.location
    if(pathname.length<2) window.location.pathname='home'
  },[])
  return <BrowserRouter>
    <Route path="/:room" component={Room} />
  </BrowserRouter>
}

function Room(props) {
  const {room} = props.match.params
  const messages = useDB(room)
  const title = 'Chatter'
  const [name, setName] = useState('Tiffany')
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
        return <div key={i} className="message-wrap"
        from={m.name===name?'me':'you'}>
          <div className="message">
            <div className="msg-name">{m.name}</div>
            <div className="msg-text">{m.text}</div>
          </div>
        </div>
      })}
    </div>

    <TextInput onSend={(text)=> {
      db.send({
        text, name, ts: new Date(), room
      })
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