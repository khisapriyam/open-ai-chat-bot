"use client"; // This is a client component 👈🏽
import { useState } from 'react'
import Image from 'next/image'
import styles from './page.module.css'
import axios from 'axios'
import Animation from '@/components/Animation';


export default function Home() {

  //creating states
  const [inputValue, setInputValue] = useState('')
  const [chatLog, setChatLog] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  //this function is triggered when the user clicks the submit button
  const handleSubmit = (e) =>{
    e.preventDefault()

    setChatLog((preventChatLog) => [...preventChatLog, { type: 'user', message: inputValue}])

    sendMessage(inputValue)

    //clearing the user input
    setInputValue('')
  }

  //function to get data from openAI
  const sendMessage = (message) => {
    const url = 'https://api.openai.com/v1/chat/completions'
    const headers = {
      'Content-type' : 'application/json',
      'Authorization' : `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`
    }
    const data = {
      model: "gpt-3.5-turbo-0301",
      messages: [{"role":"user", "content": message}]
    }
    setIsLoading(true)

    //making ppost request to server
    axios.post(url, data, {headers: headers}).then((response => {
      console.log(response);
      setChatLog((preventChatLog) => [...preventChatLog, { type: 'bot', message: response.data.choices[0].message.content }])
      setIsLoading(false)
    })).catch((err) => {
      setIsLoading(false)
      console.log(err);
    })
  }
  

  return (
    <>
      <div className="container mx-auto max-w-[700px">
        <div className="flex flex-col h-screen bg-gray-900">
          <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl">Open-AI-Chat-Bot</h1>
          <div className="flex-grow p-6">
            <div className="flex flex-col space-y-4">
              {
                chatLog.map((message, index) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`${message.type === 'user' ? 'bg-purple-500' : 'bg-gray-800'} rounded-lg p-4 text-white max-w-sm`}>
                      {message.message}
                    </div>
                  </div>
                ))
              }
              {
                isLoading && 
                <div key={chatLog.length} className="flex justify-start">
                  <div className="bg-gray-800 rounded-lg p-4 text-white max-w-sm">
                    <Animation/>
                  </div>
                </div>
              }
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="flex-none p-6">
            <div className="flex rounded-lg border border-gray-700 bg-gray-800">
              <input type="text" className="flex-grow px-4 py-2 bg-transparent text-white focus:outline-none" placeholder='Type your message....' value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
              <button type="submit" className="bg-purple-400 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-500 transition-colors duration-300">Send</button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
