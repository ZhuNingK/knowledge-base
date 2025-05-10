// import your menu.js

// 运维
import devopsMenu from "./devops/base"

// java
import springMenu from "./java/spring"
import mybatisMenu from "./java/mybatis"

// database
import DatebaseMenu from "./database/database"

// project
import ProjectMenu from './project/ruoyi'

const createSidebar = () => {
  return {
    // devops
    '/docs/devops/base/': devopsMenu,
    // java
    '/docs/java/spring/': springMenu,
    '/docs/java/mybatis/': mybatisMenu,
    // database
    '/docs/database/': DatebaseMenu,
    // project
    '/docs/project/ruoyi/': ProjectMenu,

  }
}
export default createSidebar
