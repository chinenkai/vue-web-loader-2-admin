wrangler pages dev ./ --local

@rem 项目上线时，需要去网页版控制台，给KV和DB操作绑定，路径是：项目-设置-函数

@rem 创建d1数据库
@rem wrangler d1 create <YOUR_DATABASE_NAME>
@rem 然后把产生的数据库配置保存到wrangler.toml文件中
@rem 初始化本地数据库
@rem wrangler d1 execute <YOUR_DATABASE_NAME> --local --file=./functions/data/install.sql
@rem 初始化线上数据库
@rem wrangler d1 execute <YOUR_DATABASE_NAME> --remote --file=./functions/data/install.sql


@rem 创建kv数据库
@rem wrangler kv namespace create <YOUR_NAMESPACE>
@rem 然后把产生的数据库配置保存到wrangler.toml文件中


@rem 远程调试命令
@rem wrangler pages deployment tail --project-name <YOUR_PROJECT_NAME>
