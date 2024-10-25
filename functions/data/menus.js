import item1 from "./item1.js"
import system from "./system.js"
const menus = [
	item1,
	system,
]

export default menus;
export async function onRequest(context) {
    return new Response(null, { status: 404 })
}