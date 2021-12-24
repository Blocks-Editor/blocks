// import {Actor, HttpAgent} from '@dfinity/agent';
//
// const SHARE_CANISTER_ID = 'vhtho-raaaa-aaaab-qadoq-cai';
//
// const agent = new HttpAgent({});
// // const hostname = agent._host.hostname;
// // if(hostname === '127.0.0.1' || hostname.endsWith('localhost')) {
// //     agent.fetchRootKey();
// // }
//
// const shareActor = Actor.createActor(({IDL}) => {
//     console.log(IDL);////
//     return IDL.Service({
//         putProject: IDL.Func([], [], []),
//     });
// }, {
//     agent,
//     canisterId: SHARE_CANISTER_ID,
// });
//
// export async function createMotokoPlaygroundShareLink(outputText) {
//     const project = {
//         files: [{
//             name: 'Main',
//             content: outputText,
//         }],
//         packages: [],
//         canisters: [],
//     };
//
//
// }