# react-blocks-editor

> Embed the [Blocks Editor](https://github.com/Blocks-Editor/blocks) anywhere using a React component.

[![NPM](https://img.shields.io/npm/v/react-blocks-editor.svg)](https://www.npmjs.com/package/react-blocks-editor) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-blocks-editor
```

## Usage

```tsx
import React from 'react'
import BlocksEditor from 'react-blocks-editor'

const MyEditor = () => {
  const options = {
    menu: 'hidden' // default: undefined
  }

  return (
    <BlocksEditor style={{ width: '100%', height: 400 }} options={options}>
      {({ loadState }) => {
        console.log('Loaded iframe.')

        loadState({
          name: 'Project name',
          description: 'Project description',
          nodes: [{...}]
        })
      }}
    </BlocksEditor>
  )
}
```

---

This project was made possible via the [DFINITY Developer Grant Program](https://dfinity.org/grants/).
