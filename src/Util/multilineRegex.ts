
function append(acc: string, value: string): string {
    return acc + value
    .replace(/^\s*/, '')
    .replace(/\s*$/, '');
}

export function regex(...definition:RegExp[]): RegExp {
    const regexString = definition
        .map((value) => value.source)
        .reduce(append);
    return new RegExp(regexString);
}
