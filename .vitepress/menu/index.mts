// import your menu.js

// 运维
import devopsMenu from "./devops/base"
import javaJenkinsMenu from "./java/jenkins"

const createSidebar = () => {
  return {
    // devops
    '/docs/devops/base/': devopsMenu,
    // java
    '/docs/java/jenkins/': javaJenkinsMenu,

  }
}
export default createSidebar
