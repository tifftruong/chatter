import {useState, useEffect} from 'react'
import * as firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"

let store
const coll = 'messages'

function useDB(room) {
    const [messages, setMessages] = useState([])

    function add(m) {
        setMessages(current => {
            const msgs = [m, ...current]
            msgs.sort((a,b)=> b.ts.seconds - a.ts.seconds)
            return msgs
        })
    }
    function remove(id) {
        setMessages(current=> current.filter(m=> m.id!==id))
    }
    
    useEffect(() => {
        store.collection(coll)
        .where('room','==',room)
        .onSnapshot(snap=> snap.docChanges().forEach(c=> {
            const {doc, type} = c
            if (type==='added') add({...doc.data(),id:doc.id})
            if (type==='removed') remove(doc.id)
        }))
    }, [])
    return messages
}

const db = {}
db.send = function(msg) {
    return store.collection(coll).add(msg)
}
db.delete = function(id) {
    return store.collection(coll).doc(id).delete()
}

export { db, useDB }

const firebaseConfig = {
    apiKey: "AIzaSyCn5Pz7qGloaDo0rhrPa9bxgGl31mPbDzc",
    authDomain: "chatter2020-7bfeb.firebaseapp.com",
    databaseURL: "https://chatter2020-7bfeb.firebaseio.com",
    projectId: "chatter2020-7bfeb",
    storageBucket: "chatter2020-7bfeb.appspot.com",
    messagingSenderId: "923716410358",
    appId: "1:923716410358:web:a9251cd5f11764a45305d7"
  }

  firebase.initializeApp(firebaseConfig)
  store = firebase.firestore()