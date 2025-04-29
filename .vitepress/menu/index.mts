// import your menu.js

// 运维
import devopsMenu from "./devops/base"

// java
import springMenu from "./java/spring"
import javaJenkinsMenu from "./java/jenkins"
import mybatisMenu from "./java/mybatis"

// SQL
import SQLMenu from "./sql/sql"

const createSidebar = () => {
  return {
    // devops
    '/docs/devops/base/': devopsMenu,
    // java
    '/docs/java/spring/': springMenu,
    '/docs/java/jenkins/': javaJenkinsMenu,
    '/docs/java/mybatis/': mybatisMenu,

    // SQL
    '/docs/sql/': SQLMenu,

  }
}
export default createSidebar
