// import your menu.js

// 运维
import devopsMenu from "./devops/base"

// 中间件
import middlewareMenu from "./middleware/middleware"

// 后端
import JavaMenu from "./backend/java"

// database
import DatabaseMenu from "./database/database"


const createSidebar = () => {
  return {
    // devops
    '/docs/devops/base/': devopsMenu,
    // middleware
    '/docs/middleware/': middlewareMenu,
    // 后端
    '/docs/backend/java/': JavaMenu,

    // database
    '/docs/database/': DatabaseMenu,

  }
}
export default createSidebar
