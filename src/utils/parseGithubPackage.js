import parse from 'parse-github-url';

export default function parseGithubPackage(text, name) {
    if(!text) {
        return;
    }

    let result;
    try {
        result = parse(text);
        if(!result) {
            return;
        }
    }
    catch(err) {
        console.warn(err);
    }

    const {name: defaultName, repo, filepath, branch} = result;

    return {
        name: name || defaultName,
        repo,
        version: branch,
        dir: filepath,
        // homepage: ,
    };
}