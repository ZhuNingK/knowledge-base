// import your menu.js

// 运维
import devopsMenu from "./devops/base"

// 中间件
import middlewareMenu from "./middleware/middleware"

// 后端
import springMenu from "./backend/spring"
import mybatisMenu from "./backend/mybatis"
import redisMenu from "./backend/redis"

// database
import DatabaseMenu from "./database/database"


const createSidebar = () => {
  return {
    // devops
    '/docs/devops/base/': devopsMenu,
    // middleware
    '/docs/middleware/': middlewareMenu,
    // 后端
    '/docs/backend/spring/': springMenu,
    '/docs/backend/mybatis/': mybatisMenu,
    '/docs/backend/redis/': redisMenu,
    // database
    '/docs/database/': DatabaseMenu,

  }
}
export default createSidebar
