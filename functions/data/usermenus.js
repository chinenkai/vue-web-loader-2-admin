const usermenus = [
    {
        content: "退出",
        action: "ajax",
        divider: true,
        url: "../admin/manager/logout/",
    }
];

export default usermenus;
export async function onRequest(context) {
    return new Response(null, { status: 404 })
}