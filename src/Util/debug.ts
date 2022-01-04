var DEBUG = 1;

export function debug(arg: string) {
    if (DEBUG !== 0) {
        console.log(arg);
    }
}
