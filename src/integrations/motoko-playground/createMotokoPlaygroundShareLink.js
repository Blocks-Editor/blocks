// import {Actor, HttpAgent} from '@dfinity/agent';

const PLAYGROUND_CANISTER_ID = 'm7sm4-2iaaa-aaaab-qabra-cai';
// const SHARE_CANISTER_ID = 'vhtho-raaaa-aaaab-qadoq-cai';
//
// const agent = new HttpAgent({
//
// });
// // console.log(agent);////
// // agent.fetchRootKey();
//
//
// // Derived from: https://github.com/dfinity/motoko-playground/blob/main/service/saved/Types.mo
// const shareActor = Actor.createActor(({IDL}) => {
//     console.log(IDL);
//     const NamedFile = IDL.Record({
//         name: IDL.Text,
//         content: IDL.Text,
//     });
//     const PackageInfo = IDL.Record({
//         name: IDL.Text,
//         repo: IDL.Text,
//         version: IDL.Text,
//         dir: IDL.Opt(IDL.Text),
//         homepage: IDL.Opt(IDL.Text),
//     });
//     const CanisterInfo = IDL.Record({
//         id: IDL.Principal,
//         name: IDL.Text,
//         candid: IDL.Text,
//     });
//     const Project = IDL.Record({
//         files: IDL.Vec(NamedFile),
//         packages: IDL.Opt(IDL.Vec(PackageInfo)),
//         canisters: IDL.Opt(IDL.Vec(CanisterInfo)),
//     });
//     return IDL.Service({
//         putProject: IDL.Func([Project], [IDL.Nat], []),
//     });
// }, {
//     agent,
//     canisterId: SHARE_CANISTER_ID,
// });

export async function createMotokoPlaygroundShareLink(outputText, errorCallback) {
    // const project = {
    //     files: [{
    //         name: 'Main',
    //         content: outputText,
    //     }],
    //     packages: [],
    //     canisters: [],
    // };

    let tag = '_';
    // try {
    //     tag = await shareActor.putProject(project);
    // }
    // catch(err) {
    //     if(errorCallback) {
    //         // Handle error and return fallback URL
    //         errorCallback(err);
    //     }
    //     else {
    //         throw err;
    //     }
    // }
    return `https://${PLAYGROUND_CANISTER_ID}.raw.ic0.app/?tag=${tag}`;
}
