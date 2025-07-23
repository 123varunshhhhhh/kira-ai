import React, { createContext, useState, useEffect } from 'react'
export const dataContext =createContext()

export let user={
    data:null,
    mime_type:null,
    imgUrl:null
   
}
export let prevUser={
    data:null,
    mime_type:null,
    prompt:null,
    imgUrl:null
}
function UserContext({children}) {
let [startRes,setStartRes]=useState(false)
let [popUp,setPopUP]=useState(false)
let [input,setInput]=useState("")
let [feature,setFeature]=useState("chat")
let [showResult,setShowResult]=useState("")
let [prevFeature,setPrevFeature]=useState("chat")
let [genImgUrl,setGenImgUrl]=useState("")
let [history, setHistory] = useState([]); // Add history state

// Load history from localStorage on mount
useEffect(() => {
  const stored = localStorage.getItem('smartaibot_history');
  if (stored) {
    try {
      setHistory(JSON.parse(stored));
    } catch {}
  }
}, []);
// Save history to localStorage whenever it changes
useEffect(() => {
  localStorage.setItem('smartaibot_history', JSON.stringify(history));
}, [history]);

    let value={
    startRes,setStartRes,
    popUp,setPopUP,
    input,setInput,
    feature,setFeature,
    showResult,setShowResult,
    prevFeature,setPrevFeature,
    genImgUrl,setGenImgUrl,
    history,setHistory // Provide history in context
    }
  return (
    <div>
    <dataContext.Provider value={value}>
      {children}
      </dataContext.Provider>
    </div>
  )
}

export default UserContext
