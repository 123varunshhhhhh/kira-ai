import React, { useContext, useState, useEffect } from 'react'
import "./App.css"
import { RiImageAiLine } from "react-icons/ri";
import { RiImageAddLine } from "react-icons/ri";
import { MdChatBubbleOutline } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { FaArrowUpLong } from "react-icons/fa6";
import { dataContext, prevUser, user } from './UserContext.jsx';
import Chat from './Chat';
import { generateResponse } from './gemini';
import { query } from './huggingFace';
// Custom hook to track window width
function useWindowWidth() {
  const [width, setWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));
  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width;
}
function Home() {
let {startRes,setStartRes,popUp,setPopUP,input,setInput,feature,setFeature,showResult,setShowResult,prevFeature,setPrevFeature,genImgUrl,setGenImgUrl,history,setHistory}=useContext(dataContext)
const [hoveredIdx, setHoveredIdx] = useState(null); // For hover preview
const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile sidebar
const windowWidth = useWindowWidth();
const isMobile = windowWidth <= 700;
const isTablet = windowWidth > 700 && windowWidth <= 1100;
const sidebarWidth = isMobile ? undefined : isTablet ? 180 : 270;

async function handleSubmit(e){

setStartRes(true)
setPrevFeature(feature)

setShowResult("")
prevUser.data=user.data;
prevUser.mime_type=user.mime_type;
prevUser.imgUrl=user.imgUrl;
prevUser.prompt=input
user.data=null
user.mime_type=null
user.imgUrl=null
let promptCopy = input;
setInput("")
let result=await generateResponse()
setShowResult(result)
setFeature("chat")
setHistory(prev => [...prev, { prompt: promptCopy, result, type: 'chat', timestamp: Date.now() }]); // Add chat to history


}
function handleImage(e){
setFeature("upimg")
let file=e.target.files[0]

let reader=new FileReader()
reader.onload=(event)=>{
let base64=event.target.result.split(",")[1]
user.data=base64
user.mime_type=file.type
user.imgUrl=`data:${user.mime_type};base64,${user.data}`
setHistory(prev => [...prev, { prompt: file.name, imageUrl: user.imgUrl, type: 'upload', timestamp: Date.now() }]); // Add upload to history
}
reader.readAsDataURL(file)
}

async function handleGenerateImg() {
    setStartRes(true);
    setPrevFeature(feature);
    setGenImgUrl("");
    prevUser.prompt = input;
    setFeature("chat");
    try {
        const blob = await query(input);
        const url = URL.createObjectURL(blob);
        setGenImgUrl(url);
        setHistory(prev => [...prev, { prompt: input, imageUrl: url, type: 'genimg', timestamp: Date.now() }]); // Add to history
        setInput(""); // Clear input after using it
    } catch (error) {
        alert("Image generation failed. " + (error?.message || "Please try again."));
    }
}
  return (
    <div className='home' style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar toggle button for mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        style={{
          position: 'fixed',
          top: isMobile ? 60 : -9999,
          left: isMobile ? 10 : -9999,
          zIndex: 1001,
          background: '#181c1f',
          color: '#7fd7ff',
          border: '2px solid #7fd7ff',
          borderRadius: '50%',
          width: 40,
          height: 40,
          fontSize: 24,
          display: isMobile ? 'block' : 'none',
          cursor: 'pointer',
        }}
        aria-label="Open history sidebar"
      >☰</button>
      {/* Sidebar backdrop for mobile */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.45)',
            zIndex: 999,
          }}
        />
      )}
      {/* Responsive Sidebar */}
      <div style={{
        width: isMobile ? '80vw' : sidebarWidth,
        minWidth: isMobile ? '0' : isTablet ? 140 : 220,
        maxWidth: isMobile ? '90vw' : isTablet ? 200 : 320,
        background: 'rgba(20,20,20,0.95)',
        borderRight: '2px solid #222',
        padding: '20px 10px 10px 10px',
        boxSizing: 'border-box',
        display: isMobile ? (sidebarOpen ? 'flex' : 'none') : 'flex',
        flexDirection: 'column',
        position: isMobile ? 'fixed' : 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 1000,
        height: '100vh',
        overflowY: 'auto',
        transition: 'transform 0.3s',
        boxShadow: isMobile && sidebarOpen ? '2px 0 16px #000a' : undefined,
      }}>
        {/* Close button for mobile */}
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              background: '#222',
              color: '#ff6b6b',
              border: 'none',
              borderRadius: '50%',
              width: 36,
              height: 36,
              fontSize: 22,
              cursor: 'pointer',
              zIndex: 1002,
            }}
            aria-label="Close history sidebar"
          >×</button>
        )}
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px'}}>
          <h2 style={{color: 'white', margin: 0, fontSize: '1.3rem'}}>History</h2>
          <button
            onClick={() => setHistory([])}
            style={{
              background: '#222',
              color: '#7fd7ff',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 14px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.10)'
            }}
          >
            Clear History
          </button>
        </div>
        {history.length === 0 ? (
          <div style={{color: '#aaa', textAlign: 'center', padding: '30px 0'}}>No history yet. Start chatting, uploading, or generating images!</div>
        ) : (
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {history.slice().reverse().map((item, idx, arr) => {
              const isMostRecent = idx === 0;
              return (
                <div key={item.timestamp + idx} style={{
                  background: isMostRecent ? '#232b36' : '#181c1f',
                  borderRadius: '12px',
                  padding: '10px',
                  color: 'white',
                  boxShadow: isMostRecent ? '0 2px 8px #7fd7ff44' : '0 1px 4px rgba(0,0,0,0.15)',
                  position: 'relative',
                  border: isMostRecent ? '2px solid #7fd7ff' : '2px solid transparent',
                  transition: 'box-shadow 0.2s, border 0.2s',
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Delete button */}
                  <button
                    onClick={() => {
                      const idxInHistory = history.length - 1 - idx;
                      setHistory(prev => prev.filter((_, i) => i !== idxInHistory));
                    }}
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      background: 'transparent',
                      border: 'none',
                      color: '#ff6b6b',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      cursor: 'pointer',
                      zIndex: 2
                    }}
                    title="Delete this history item"
                  >×</button>
                  {/* Copy prompt button */}
                  <button
                    onClick={() => navigator.clipboard.writeText(item.prompt)}
                    style={{
                      position: 'absolute',
                      top: 6,
                      left: 6,
                      background: 'transparent',
                      border: 'none',
                      color: '#7fd7ff',
                      fontSize: '15px',
                      cursor: 'pointer',
                      zIndex: 2
                    }}
                    title="Copy prompt"
                  >📋</button>
                  <div
                    style={{fontSize: '13px', marginBottom: '8px', color: '#7fd7ff', cursor: item.type === 'genimg' ? 'pointer' : 'default', textDecoration: item.type === 'genimg' ? 'underline' : 'none'}}
                    title={item.type === 'genimg' ? 'Click to re-use this prompt' : undefined}
                    onClick={item.type === 'genimg' ? () => { setInput(item.prompt); setFeature('genimg'); } : undefined}
                  >
                    {item.type === 'upload' && <span style={{color:'#0f0', marginRight:4}}>🖼️</span>}
                    {item.type === 'genimg' && <span style={{color:'#0ff', marginRight:4}}>🎨</span>}
                    {item.type === 'chat' && <span style={{color:'#ff0', marginRight:4}}>💬</span>}
                    {item.prompt}
                  </div>
                  {item.imageUrl && <img src={item.imageUrl} alt={item.prompt} style={{width: '100%', borderRadius: '8px', marginBottom: '4px'}} />}
                  {item.type === 'chat' && <div style={{marginTop: '8px', color: '#fff', fontSize: '14px', background:'#222', borderRadius:'6px', padding:'6px'}}>{item.result}</div>}
                  {/* Hover preview for image */}
                  {hoveredIdx === idx && item.imageUrl && (
                    <div style={{
                      position: 'fixed',
                      left: isMobile ? '10vw' : (isTablet ? '200px' : '290px'),
                      top: '60px',
                      zIndex: 1000,
                      background: '#222',
                      border: '2px solid #7fd7ff',
                      borderRadius: '12px',
                      padding: '10px',
                      boxShadow: '0 4px 16px #000a',
                      maxWidth: '350px',
                      maxHeight: '350px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <img src={item.imageUrl} alt={item.prompt} style={{maxWidth: '320px', maxHeight: '320px', borderRadius: '8px'}} />
                    </div>
                  )}
                  {/* Hover preview for chat */}
                  {hoveredIdx === idx && item.type === 'chat' && (
                    <div style={{
                      position: 'fixed',
                      left: isMobile ? '10vw' : (isTablet ? '200px' : '290px'),
                      top: '60px',
                      zIndex: 1000,
                      background: '#222',
                      border: '2px solid #ff0',
                      borderRadius: '12px',
                      padding: '10px',
                      boxShadow: '0 4px 16px #000a',
                      maxWidth: '350px',
                      color: '#fff',
                      fontSize: '15px',
                      whiteSpace: 'pre-wrap',
                    }}>
                      {item.result}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Main Content with left margin for sidebar (or none on mobile) */}
      <div style={{ flex: 1, marginLeft: isMobile ? 0 : sidebarWidth, minWidth: 0, position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <nav>
            <div className="logo" onClick={()=>{
                setStartRes(false)
                setFeature("chat")
                user.data=null
user.mime_type=null
user.imgUrl=null
setPopUP(false)
            }}>
                Kira AI
            </div>
        </nav>
        <input type="file" accept='image/*' hidden id='inputImg' onChange={handleImage}/>
        {!startRes? <div className="hero" style={{width: '100%'}}>
            <span id="tag">What can I help with ?</span>
            <div className="cate">
                <div className="upImg" onClick={()=>{
                    document.getElementById("inputImg").click()
                }}>
                <RiImageAddLine />
                <span>Upload Image</span>
                </div>
                <div className="genImg" onClick={()=>setFeature("genimg")}> 
                <RiImageAiLine />
                <span>Generate Image</span>
                </div>
                <div className="chat" onClick={()=>setFeature("chat")}> 
                <MdChatBubbleOutline />
                <span>Let's Chat</span>
                </div>
            </div>
        </div>
        :
        <Chat/>
        }
        {/* Centered fixed bottom input box within main content area */}
        <div style={{
          width: '100%',
          position: 'fixed',
          left: isMobile ? 0 : sidebarWidth,
          bottom: 0,
          zIndex: 20,
          background: 'rgba(11,16,17,0.98)',
          borderTop: '2px solid #222',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0px 0',
        }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: isMobile ? 'center' : 'flex-start', marginLeft: isMobile ? 0 : '60px' }}>
            <form  className="input-box" style={{
              width: '100%',
              maxWidth: isTablet ? '700px' : '1050px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              padding: '0px 20px',
            }}
            onSubmit={(e)=>{
                e.preventDefault()
                if(input){
                    if(feature=="genimg"){
                        handleGenerateImg()
                    }
                    else{
                        handleSubmit(e)
                    }
                   }
                }
                }>
        <img src={user.imgUrl} alt="" id="im" />
                {popUp? <div className="pop-up">
                    <div className="select-up" onClick={()=>{
                        setPopUP(false)
                        setFeature("chat")
                        document.getElementById("inputImg").click()
                    }}>
                    <RiImageAddLine />
                    <span>Upload Image</span>
                    </div>
                    <div className="select-gen" onClick={()=>{
                        setFeature("genimg")
                        setPopUP(false)
                        
                        }}>
                    <RiImageAiLine />
                    <span>Generate Image</span> 
                 </div>
                </div>:null}
               
        <div id="add" onClick={()=>{
            setPopUP(prev=>!prev)
        }}>
            {feature=="genimg"? <RiImageAiLine  id="genImg"/>:<FiPlus />}
        </div>
        <input type="text" placeholder='Ask Something...' onChange={(e)=>setInput(e.target.value)} value={input} style={{flex: 1, minWidth: 0}}/>
        {input?<button id="submit">
        <FaArrowUpLong />
        </button>:null}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
