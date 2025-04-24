// sidebar.mts
import { set_sidebar } from "../utils/auto_silebar";

export default {
    "/project/devops/base/": set_sidebar("/project/devops/base/"),
    "/project/devops/docker/": set_sidebar("/project/devops/docker/"),
    "/project/devops/harbor/": set_sidebar("/project/devops/harbor/"),
    "/project/devops/k8s/": set_sidebar("/project/devops/k8s/"),
    "/project/devops/jenkins/": set_sidebar("/project/devops/jenkins/"),
    "/project/devops/nfs/": set_sidebar("/project/devops/nfs/"),

}