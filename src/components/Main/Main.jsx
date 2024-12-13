import React, { useContext, useState } from "react";
import'./Main.css'
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Main =() =>{

const {onSent,recentPrompt,showResult,loading,resultData,setInput,input} = useContext(Context)
const [showUserDetails, setShowUserDetails] = useState(false);
const [isListening, setIsListening] = useState(false);

const handleKeyPress = (e) => {
    if(e.key === 'Enter' && input.trim()) {
        onSent();
    }
}

const handleCardClick = (prompt) => {
    setInput(prompt);
    onSent(prompt);
}

const toggleUserDetails = () => {
    setShowUserDetails(!showUserDetails);
}

const handleMicClick = () => {
    if (typeof window !== 'undefined' && 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            
            setInput(transcript);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        if (!isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }
    } else {
        alert('Speech recognition is not supported in this browser.');
    }
}

    return(
        <div className="main">
            <div className="nav">
                <p>Gemini</p>
                <img src={assets.user_icon} alt="" onClick={toggleUserDetails} style={{cursor: 'pointer'}} />
                {showUserDetails && (
                    <div className="user-details">
                        <h3>User Details</h3>
                        <p>Name: Harsh Chovatiya</p>
                        <p>Email: harshchovatiya16@gmail.com</p>
                        <p>Role: Founder</p>
                    </div>
                )}
            </div>
            <div className="main-container">

                {!showResult ? 
                <>
                    <div className="greet">
                    <p><span>Hello,Dev</span></p>
                    <p>How can I help you today</p>
                </div>
                <div className="cards">
                    <div className="card" onClick={() => handleCardClick("Suggest beautiful places to see on an upcoming road trip")}>
                        <p>Suggest beautiful places to see on an upcoming road trip</p>
                        <img src={assets.compass_icon} alt="" />
                    </div>
                    <div className="card" onClick={() => handleCardClick("Briefly summarize this concept: urban planning")}>
                        <p>Briefly summarize this concept: urban planning</p>
                        <img src={assets.bulb_icon} alt="" />
                    </div>
                    <div className="card" onClick={() => handleCardClick("Brainstorm team bonding activities for our work retreat")}>
                        <p>Brainstorm team bonding activities for our work retreat</p>
                        <img src={assets.message_icon} alt="" />
                    </div>
                    <div className="card" onClick={() => handleCardClick("Improve the readability of the following code")}>
                        <p>Improve the readability of the following code</p>
                        <img src={assets.code_icon} alt="" />
                    </div>
                </div>
                </>:
                    <div className='result'>
                        <div className="result-title">
                            <img src={assets.user_icon} alt="" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            <img src={assets.gemini_icon} alt="" />
                            {loading ? <div className='loader'><hr /><hr /><hr /></div>:<p dangerouslySetInnerHTML={{__html:resultData}}></p>}  
                        </div>
                    </div>
                }

                <div className="main-bottom">
                    <div className="search-box">
                        <input 
                            onChange={(e)=>setInput(e.target.value)} 
                            value={input} 
                            type="text" 
                            placeholder={isListening ? 'Listening...' : 'Enter a prompt here'}
                            onKeyPress={handleKeyPress}
                        />
                        <div>
                            <img 
                                src={assets.mic_icon} 
                                alt="" 
                                onClick={handleMicClick}
                                style={{
                                    cursor: 'pointer',
                                    filter: isListening ? 'invert(40%) sepia(100%) saturate(100%) hue-rotate(0deg)' : 'none'
                                }}
                            />
                            <img 
                                onClick={() => input.trim() && onSent()} 
                                src={assets.send_icon} 
                                alt="" 
                                style={{
                                    cursor: input.trim() ? 'pointer' : 'not-allowed',
                                    opacity: input.trim() ? 1 : 0.5
                                }}
                            />
                        </div>
                    </div>
                    <p className="bottom-info">Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy and Gemini Apps</p>
                </div>
            </div>
        </div>
    )
}

export default Main