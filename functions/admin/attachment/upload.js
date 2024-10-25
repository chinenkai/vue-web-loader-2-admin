import attachment from "./init.js"
class upload extends attachment {
    constructor(context) {
        super(context, 'upload');
    }

    async respond() {
        // 检查用户是否重复登录
        await this.auto_check_login();

        let key = this._get['fileKey'];

        const result = await this.savefile(key);

        if(result.status == 0){
            return this.send_json(0,result.msg);
        }

        // 业务代码
        return this.send_json(1, '上传成功',{
            "name": result.file_name,
            "url" : result.url,
        });
    }
}
export async function onRequest(context) {
    return await new upload(context).init();
}