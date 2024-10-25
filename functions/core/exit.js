class ResponseExit extends Error {
    constructor(response) {
        super('ResponseExit');
        this.response = response;
    }
}

function exit(response) {
    console.log('return by exit:');
    throw new ResponseExit(response);
}
export { ResponseExit, exit };
export async function onRequest(context) {
    return new Response(null, { status: 404 })
}