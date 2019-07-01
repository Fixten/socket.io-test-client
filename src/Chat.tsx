import React, { useState, useEffect, useCallback } from 'react'
import io from 'socket.io-client'

export type user = { sessionId: string; friendId: string }
type message = { author: string; text: string; timeStamp: number }
type messages = message[]

const url: string = 'https://bsm.bluedot-labs.com/chat'

export const Chat = (user: user): JSX.Element => {
  const { sessionId, friendId }: user = user
  const [roomId, setRoomId] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const [messages, setMessages] = useState<messages>([])
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null)
  const [text, setText] = useState<string>('')

  const addMessage = useCallback(
    (messageText: string, author: string, timeStamp: number): void => {
      setMessages((prevState: messages) => {
        return [{ author, text: messageText, timeStamp }, ...prevState]
      })
    },
    []
  )

  useEffect(() => {
    const newSocket: SocketIOClient.Socket = io(url)
    setSocket(newSocket)
  }, [])

  useEffect(() => {
    if (socket) {
      socket.emit(
        'authorization',
        { sessionId, friendId },
        (_id: string, roomId: string, messages: messages): void => {
          setRoomId(roomId)
          setUserId(_id)
          setMessages(messages.reverse())
          socket.on('message', (messageText: string, timeStamp: number) =>
            addMessage(messageText, friendId, timeStamp)
          )
        }
      )
    }
  }, [socket, sessionId, friendId, addMessage])

  function send(event: React.FormEvent): void {
    event.preventDefault()
    if (socket)
      socket.send(userId, roomId, text, (timeStamp: number) => {
        addMessage(text, userId, timeStamp)
        setText('')
      })
  }

  if (roomId) {
    return (
      <div>
        <form onSubmit={send}>
          <input onChange={e => setText(e.target.value)} value={text} />
          <button type="submit">Send!!!</button>
        </form>
        <ul>
          {messages.map((item: message, index: number) => {
            const { author, text }: message = item
            return (
              <li key={index}>
                <p>{author}</p>
                <h3>{text}</h3>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
  return <div />
}
