export default function(timeout: number): Promise<any> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true)
        }, timeout);
    })
}