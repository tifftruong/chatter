import React, {useState, useEffect} from 'react'
import './App.css'
import {db, useDB} from './db'
import NamePicker from './namePicker'
import { BrowserRouter, Route } from 'react-router-dom'
import Camera from 'react-snap-pic'
import {FiCamera} from 'react-icons/fi'
import * as firebase from "firebase/app"
import "firebase/storage"

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
  const [name, setName] = useState('Tiffany')
  const [showCamera, setShowCamera] = useState(false)
  const messages = useDB(room)

  async function takePicture(img) {
    setShowCamera(false)
    const imgID = Math.random().toString(36).substring(7)
    var storageRef = firebase.storage().ref()
    var ref = storageRef.child(imgID + '.jpg')
    await ref.putString(img, 'data_url')
    db.send({ 
      img: imgID, name, ts: new Date(), room 
    })
  }

  return <main>

  {showCamera && <Camera takePicture={takePicture} />}

    <header> 
      <div>
        <img className="logo"
          alt="logo"
          src="https://sdl-stickershop.line.naver.jp/products/0/0/1/1292998/android/stickers/11864944.png;compress=true" 
        />
        Chatter
      </div>
      <NamePicker onSave={setName}/>
    </header>

    <div className="messages">
      {messages.map((m,i)=> <Message key={i} m={m} name={name} />)}
    </div>

    <TextInput 
      showCamera={()=>setShowCamera(true)}
      onSend={(text)=> {
        db.send({
          text, name, ts: new Date(), room
        })
      }} />
  </main>
}

const bucket = 'https://console.firebase.google.com/project/chatter2020-7bfeb/storage/chatter2020-7bfeb.appspot.com/files'
const suffix = '.jpg?alt=media'

function Message({m, name}){
  return <div className="message-wrap"
  from={m.name===name?'me':'you'}>
    <div className="message">
      <div className="msg-name">{m.name}</div>
      <div className="msg-text">{m.text}</div>
      {m.img && <img src={bucket + m.img + suffix} alt="pic"/>}
    </div>
  </div>
}

function TextInput(props){
  var [text, setText] = useState('') 

  // normal js comment
  return <div className="text-input-wrap">
    <button onClick={props.showCamera}
      style={{position:'absolute', left:2, top:10}}>
      <FiCamera style={{height:15, width:15}} />
    </button>
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