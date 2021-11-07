import React, { useEffect } from 'react'
import { stringify } from 'query-string'

const DEFAULT_URL =
  process.env.BLOCKS_URL ?? 'https://blocks-editor.github.io/blocks'

// TODO: Rete.js node type checking
type Node = any

interface State {
  version: string
  name: string
  description?: string
  nodes: [Node]
}

interface LocalMessage {
  type: 'load'
  state: State
}

interface RemoteMessage {
  type: 'save'
  state: State
}

interface LoadArgs {
  sendMessage: (message: LocalMessage) => void
  loadState: (state: State) => void
}

interface QueryOptions {
  menu?: 'hidden'
}

export interface EditorPropTypes {
  url?: string
  onSave?: (state: State) => void
  options?: QueryOptions
  children?: (args: LoadArgs) => void

  [x: string]: any
}

export const BlocksEditor = ({
  url = DEFAULT_URL,
  onSave,
  options,
  children,
  ...rest
}: EditorPropTypes) => {
  let iframeRef: HTMLIFrameElement
  const setIframeRef = (ref: HTMLIFrameElement) => (iframeRef = ref)

  useEffect(() => {
    const handleMessage = ({
      source,
      data
    }: MessageEvent & { data: RemoteMessage }) => {
      const childWindow = iframeRef?.contentWindow
      if (source === childWindow) {
        if (data.type === 'save' && onSave) {
          onSave(data.state)
        }
      }
    }
    window.addEventListener('message', handleMessage)
    return () => {
      window.removeEventListener('message', handleMessage)
    }
  })

  const handleLoad = () => {
    const sendMessage = (message: LocalMessage) => {
      if (iframeRef && iframeRef.contentWindow) {
        iframeRef.contentWindow.postMessage(JSON.stringify(message), '*')
      }
    }
    const loadState = (state: State) => sendMessage({ type: 'load', state })

    if (children) {
      children({
        sendMessage,
        loadState
      })
    }
  }

  return (
    <iframe
      ref={setIframeRef}
      onLoad={handleLoad}
      src={options ? `${url}?${stringify(options)}` : url}
      {...(rest as object)}
    />
  )
}
