# Blocks - Webapp

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
