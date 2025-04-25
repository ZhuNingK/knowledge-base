// import your menu.js

// 运维
import devopsMenu from "./devops/base"
import javaJenkinsMenu from "./java/jenkins"
import mybatisMenu from "./java/mybatis"

const createSidebar = () => {
  return {
    // devops
    '/docs/devops/base/': devopsMenu,
    // java
    '/docs/java/jenkins/': javaJenkinsMenu,
    '/docs/java/mybatis/': mybatisMenu,

  }
}
export default createSidebar
