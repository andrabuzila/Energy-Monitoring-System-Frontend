import React, { useEffect, useState } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import "../styles/chatRoom.scss"
import axios from 'axios'

var stompClient =null;
const ChatRoom = () => {
    const [privateChats, setPrivateChats] = useState(new Map());     
    const [publicChats, setPublicChats] = useState([]); 
    const [isTypingVisible, setIsTypingVisible] = useState(true)
    const [messageTyping, setMessageTyping] = useState(0)
    const [userIsSet, setUserIsSet] = useState(false); 
    const [tab,setTab] =useState("CHATROOM");
    const [userData, setUserData] = useState({
        username: '',
        receivername: '',
        connected: false,
        message: ''
      });

    useEffect( () => {
        (async () => getUser())()
    }, [])

    useEffect(() => {
        if(userIsSet)
            connect()
    },[userIsSet])

    useEffect(() => {
        if(privateChats.get(tab) !== undefined)
        {
            let a;
            privateChats.get(tab).map((chat)=>{chat.message === "typing" && chat.senderName !== userData.username ? a=true : a=false})
            setIsTypingVisible(a)
        }
    },[messageTyping])

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageTyping(messageTyping => messageTyping + 1)
        }, 500)
        return () => clearInterval(interval);
    },[])

    const getUser = async () => {
        try{
            const value = await axios.get(`http://localhost:8083/Administrator/GetCurrentUser/${localStorage.getItem("userId")}`);
            setUserData({...userData,"username": value.data.name});
            setUserIsSet(true)
        } catch (error) {
            console.log("error")
        }
    }

    const connect =()=>{
        let Sock = new SockJS('http://localhost:8083/ws');
        stompClient = over(Sock);
        stompClient.connect({},onConnected, onError);
    }

    const onConnected = () => {
        setUserData({...userData,"connected": true});
        stompClient.subscribe('/chatroom/public', onMessageReceived);
        stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
        userJoin();
    }

    const userJoin=()=>{
          var chatMessage = {
            senderName: userData.username,
            status:"JOIN"
          };
          stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onMessageReceived = (payload)=>{
        var payloadData = JSON.parse(payload.body);
        switch(payloadData.status){
            case "JOIN":
                if(!privateChats.get(payloadData.senderName)){
                    privateChats.set(payloadData.senderName,[]);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                setPublicChats([...publicChats]);
                break;
        }
    }
    
    const onPrivateMessage = (payload)=>{
        console.log(payload);
        var payloadData = JSON.parse(payload.body);
        if(privateChats.get(payloadData.senderName)){
            privateChats.get(payloadData.senderName).push(payloadData);
            setPrivateChats(new Map(privateChats));
        }else{
            let list =[];
            list.push(payloadData);
            privateChats.set(payloadData.senderName,list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);
        
    }

    const onMessageChange =(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message": value});
    }

    const onPrivateMessageChange =(event)=>{
        setMessageTyping(messageTyping+1)
        const {value}=event.target;
        setUserData({...userData,"message": value});

        if (stompClient) {
            var chatMessage = {
              senderName: userData.username,
              receiverName:tab,
              message: "typing",
              status:"MESSAGE"
            };
            
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
            
          }
    }
    const sendValue=()=>{
            if (stompClient) {
              var chatMessage = {
                senderName: userData.username,
                message: userData.message,
                status:"MESSAGE"
              };
              console.log(chatMessage);
              stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
              setUserData({...userData,"message": ""});
            }
    }

    const sendPrivateValue=()=>{
        
        if (stompClient) {
          var chatMessage = {
            senderName: userData.username,
            receiverName:tab,
            message: userData.message,
            status:"MESSAGE"
          };
          
          if(userData.username !== tab){
            privateChats.get(tab).push(chatMessage);
            setPrivateChats(new Map(privateChats));
          }
          stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
          setUserData({...userData,"message": ""});
        }
    }

    const setCurrentTabCommon =() => {
        setTab("CHATROOM")
    }

    return (
    <div className="container">
        <div className='chat-container'>
        <div className="member-list">
                <ul>
                    <li onClick={setCurrentTabCommon} className={`member ${tab==="CHATROOM" && "active"}`}>Chatroom</li>
                    {[...privateChats.keys()].map((name,index)=>(
                        <li onClick={()=>{setTab(name); setMessageTyping(messageTyping+1)}} className={`member ${tab===name && "active"}`} key={index}>{name}</li>
                    ))}
                </ul>
            </div>
        </div>
        <div className="chat-container">
            {tab==="CHATROOM" && <div className="chat-content">
                <ul className="chat-messages">
                    {publicChats.map((chat,index)=>(
                        <li className={`message ${chat.senderName === userData.username && "self"}`} key={index} >
                            {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                            <div className="message-data">{chat.message}</div>
                            {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                        </li>
                    ))}
                </ul>

                <div className="send-message">
                    <input type="text" className="input-message" placeholder="your message..." value={userData.message} onChange={onMessageChange} /> 
                    <button type="button" className="my-btn" onClick={sendValue}>send</button>
                </div>
            </div>}
            {tab!=="CHATROOM" && <div className="chat-content">
                <ul className="chat-messages" >
                    {[...privateChats.get(tab)].map((chat,index)=>(
                        <li className={`message ${chat.senderName === userData.username && "self"}`} key={index} hidden={chat.message === "typing"}>
                            {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
                            <div className="message-data">{chat.message}</div>
                            {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
                        </li>
                        
                    ))}
                </ul>
                  
                <div hidden={!isTypingVisible}>
                    {tab} is typing...
                </div>

                <div className="send-message">
                    <input type="text" className="input-message" placeholder="your message..." value={userData.message} onChange={onPrivateMessageChange} /> 
                    <button type="button" className="my-btn" onClick={sendPrivateValue}>send</button>
                </div>
            </div>}
        </div>
        
    </div>
    )
}

export default ChatRoom
