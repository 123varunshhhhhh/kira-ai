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

// Authentication state
let [currentUser, setCurrentUser] = useState(null);
let [isAuthenticated, setIsAuthenticated] = useState(false);
let [showAuthModal, setShowAuthModal] = useState(false);
let [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

// Load user from localStorage on mount
useEffect(() => {
  const storedUser = localStorage.getItem('kiraai_user');
  if (storedUser) {
    try {
      const userData = JSON.parse(storedUser);
      setCurrentUser(userData);
      setIsAuthenticated(true);
    } catch {}
  }
}, []);

// Load history from localStorage on mount (user-specific)
useEffect(() => {
  if (currentUser) {
    const stored = localStorage.getItem(`kiraai_history_${currentUser.id}`);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {}
    } else {
      setHistory([]);
    }
  } else {
    // For non-authenticated users, use anonymous history
    const stored = localStorage.getItem('kiraai_anonymous_history');
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {}
    }
  }
}, [currentUser]);

// Save history to localStorage whenever it changes (user-specific)
useEffect(() => {
  if (currentUser) {
    localStorage.setItem(`kiraai_history_${currentUser.id}`, JSON.stringify(history));
  } else {
    localStorage.setItem('kiraai_anonymous_history', JSON.stringify(history));
  }
}, [history, currentUser]);

// Authentication functions
const login = (email, password) => {
  // Simple authentication - in a real app, you'd use a backend
  const users = JSON.parse(localStorage.getItem('kiraai_users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    localStorage.setItem('kiraai_user', JSON.stringify(user));
    return { success: true };
  } else {
    return { success: false, error: 'Invalid email or password' };
  }
};

const signup = (name, email, password) => {
  const users = JSON.parse(localStorage.getItem('kiraai_users') || '[]');
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'User already exists' };
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('kiraai_users', JSON.stringify(users));
  
  // Auto-login after signup
  setCurrentUser(newUser);
  setIsAuthenticated(true);
  setShowAuthModal(false);
  localStorage.setItem('kiraai_user', JSON.stringify(newUser));
  
  return { success: true };
};

const logout = () => {
  setCurrentUser(null);
  setIsAuthenticated(false);
  setHistory([]);
  localStorage.removeItem('kiraai_user');
  // Keep anonymous history for non-authenticated users
};

    let value={
    startRes,setStartRes,
    popUp,setPopUP,
    input,setInput,
    feature,setFeature,
    showResult,setShowResult,
    prevFeature,setPrevFeature,
    genImgUrl,setGenImgUrl,
    history,setHistory, // Provide history in context
    // Authentication values
    currentUser, setCurrentUser,
    isAuthenticated, setIsAuthenticated,
    showAuthModal, setShowAuthModal,
    authMode, setAuthMode,
    login, signup, logout
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
