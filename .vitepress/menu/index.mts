// import your menu.js

// 运维
import devopsMenu from "./devops/base"

// 中间件
import middlewareMenu from "./middleware/middleware"

// java
import springMenu from "./java/spring"
import mybatisMenu from "./java/mybatis"

// database
import DatebaseMenu from "./database/database"


const createSidebar = () => {
  return {
    // devops
    '/docs/devops/base/': devopsMenu,
    // middleware
    '/docs/middleware/': middlewareMenu,
    // java
    '/docs/java/spring/': springMenu,
    '/docs/java/mybatis/': mybatisMenu,
    // database
    '/docs/database/': DatebaseMenu,

  }
}
export default createSidebar
