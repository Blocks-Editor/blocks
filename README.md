![Blocks.](./packages/blocks-webapp/public/img/logo-gradient.png)

---

*Blocks* is an online visual smart contract editor for the [Internet Computer](https://dfinity.org/).


## External Usage

Embed the Blocks Editor in your React application using the [react-blocks-editor](https://www.npmjs.com/package/react-blocks-editor) npm package.

## Local Environment

```sh
git clone --recurse-submodules https://github.com/rvanasa/blocks

# Set up Blocks version of Rete.js
cd packages/rete
npm install
npm run build

cd ../blocks-webapp
npm link ../rete
```

### Serve (http://localhost:3000):

```bash
npm start
```

### Test:

```bash
npm test
```

### Build:

```bash
npm run build
```

---

This project was made possible via the [DFINITY Developer Grant Program](https://dfinity.org/grants/).