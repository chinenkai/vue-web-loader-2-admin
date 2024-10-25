import manager from "./init.js"
class menus extends manager {
    constructor(context) {
        super(context, 'menus');
    }

    fix_menus(menus){
        return menus.default;
    }

    fix_usermenus(usermenus){
        return usermenus.default;
    }

    async respond() {
        // 检查用户是否重复登录
        await this.auto_check_login();

        try {
            let menus = this.fix_menus(await import('../../data/menus.js'));
            let usermenus = this.fix_usermenus(await import('../../data/usermenus.js'));
            return this.send_json(1, '获取菜单成功',{
                title: '',
                menus:menus,
                user:{
                    userName: this.manager_data['username'],
                    menus:usermenus ,
                },
            })
        } catch (error) {
            console.error(`Failed to load menus module: `, error);
            return this.send_json(0, '获取菜单失败', error.message);
        }
    }
}
export async function onRequest(context) {
    return await new menus(context).init();
}