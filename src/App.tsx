import React from 'react'
import { Chat, user } from './Chat'

const users: user[] = [
  {
    sessionId: '1e8f309fc0c5a7049e4ba9c0ae8fcd03',
    friendId: '5d09001c71247b7b51a170ee'
  },
  {
    sessionId: '841139361c4850786f19560c7b69d3c2',
    friendId: '5d08ff8271247b7b51a170ed'
  }
]

export function App(): JSX.Element {
  return (
    <div style={{ display: 'flex' }}>
      {users.map((item: user) => (
        <Chat key={item.sessionId} {...item} />
      ))}
    </div>
  )
}
