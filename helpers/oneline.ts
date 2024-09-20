/**
 * -----------------------------------------------------------------------------
 * A real-time website visit statistics tool using WebRTC and Peer.js.
 * Modified from the original oneline.js.
 * -----------------------------------------------------------------------------
 *
 * Source: https://github.com/ezshine/oneline.js
 * License: MIT - see LICENSE for details.
 *
 * -----------------------------------------------------------------------------
 */
import type { DataConnection } from 'peerjs'
import Peer from 'peerjs'
import { v5 as uuidv5 } from 'uuid'

export type EventCallback = (event: { detail: any }) => void

export class Oneline {
  #peerId: string = ''
  #visitorCount: number = 1
  #peer: Peer | null = null
  #connections: Map<string, DataConnection> = new Map()
  #eventListeners: Record<string, EventCallback[]> = {}

  constructor(url: string) {
    const peerId = uuidv5(url, uuidv5.URL)
    this.init(peerId)
  }

  async init(peerId: string): Promise<void> {
    this.#peerId = peerId
    this.#peer = new Peer()

    this.#peer.on('open', (id: string) => {
      if (id !== this.#peerId) {
        this.#connectToPeer(this.#peerId)
      }
      this.#updateVisitorCount()
    })

    this.#peer.on('connection', (conn: DataConnection) => {
      this.#setupConnection(conn)
    })

    this.#peer.on('error', (err: any) => {
      if (err.type === 'peer-unavailable') {
        this.#peer?.destroy()
        this.#peer = new Peer(this.#peerId)
        this.#peer.on('open', () => {
          this.#updateVisitorCount()
        })
        this.#peer.on('connection', (conn: DataConnection) => {
          this.#setupConnection(conn)
        })
      }
      else {
        console.error('PeerJS error:', err)
      }
    })

    window.addEventListener('beforeunload', () => this.#cleanup())
  }

  on(eventName: string, callback: EventCallback): void {
    if (!this.#eventListeners[eventName]) {
      this.#eventListeners[eventName] = []
    }
    this.#eventListeners[eventName].push(callback)
  }

  #triggerEvent(eventName: string, detail: any): void {
    if (this.#eventListeners[eventName]) {
      this.#eventListeners[eventName].forEach((callback) => {
        callback({ detail })
      })
    }
  }

  #updateVisitorCount(): void {
    this.#triggerEvent('OnelineUpdate', {
      count: this.#visitorCount,
    })
  }

  #broadcastVisitorCount(): void {
    this.#connections.forEach(conn => conn.send({ type: 'count', count: this.#visitorCount }))
  }

  #setupConnection(conn: DataConnection): void {
    conn.on('open', () => {
      this.#connections.set(conn.peer, conn)
      this.#visitorCount = this.#connections.size + 1
      this.#updateVisitorCount()
      this.#broadcastVisitorCount()

      conn.on('data', (data: any) => {
        if (data.type === 'count') {
          this.#visitorCount = Math.max(data.count, this.#visitorCount)
          this.#updateVisitorCount()
        }
      })

      conn.on('close', () => {
        this.#connections.delete(conn.peer)
        this.#visitorCount = this.#connections.size + 1
        this.#updateVisitorCount()
        this.#broadcastVisitorCount()
      })
    })
  }

  #connectToPeer(peerId: string): void {
    if (!this.#connections.has(peerId)) {
      const conn = this.#peer?.connect(peerId)
      if (conn) {
        this.#setupConnection(conn)
      }
    }
  }

  #cleanup(): void {
    this.#connections.forEach(conn => conn.close())
    this.#connections.clear()

    this.#peer?.destroy()
    this.#peer = null

    window.removeEventListener('beforeunload', this.#cleanup.bind(this))
  }

  destroy(): void {
    this.#cleanup()
  }
}

export default Oneline
