# SpringBoot 中 Bean 的生命周期

## 一、生命周期

### 1. 基本概述

在 Spring 中，bean 的生命周期可以分为以下几个阶段：

1. 定义阶段：

   1. 通过 `@Component`、`@Service`、`@Repository`、`@Controller` 等注解定义。
   2. 或通过 XML 配置、Java 配置类 (`@Configuration`) 定义。

2. 实例化阶段：当通过ApplicationContext获取 bean 时，如果 bean 的实例还没有创建，Spring 会调用 bean 的构造函数创建实例。通过以下方式创建Bean：

   - 构造器实例化（常用）。

     - ```java
       // 构造器实例化
       @Component
       public class MyBean {
           public MyBean() {
               System.out.println("1. 构造器执行 - 实例化阶段");
           }
       }
       ```

   - 静态工厂方法。

   - 实例工厂方法。

3. 属性赋值阶段：在实例化之后，Spring 会根据 bean 的配置信息为其赋值。通过以下方式进行属性赋值：

   - 通过 `@Autowired`、`@Value` 等注解注入依赖。

     - ```java
       @Component
       public class MyBean {
           @Value("${my.property}")
           private String property;
           
           @Autowired
           private AnotherBean anotherBean;
       }
       ```

   - 通过XML配置注入。

4. 初始化阶段：在属性赋值之后，Spring 会调用 bean 的init-method方法进行初始化。

5. 使用阶段：在初始化之后，bean 就可以被使用应用程序使用。

6. 销毁阶段：当ApplicationContext被关闭时，Spring 会调用 bean 的destroy-method方法进行销毁。

### 2. 流程图

![生命周期流程图](/public/docs/backend/springboot/springboot-life-%20cycle-image.png)

