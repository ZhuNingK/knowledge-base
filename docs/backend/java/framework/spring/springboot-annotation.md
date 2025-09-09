# 注解

## 一、启动类

### **@SpringBootApplication**

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(
    excludeFilters = {@Filter(
    type = FilterType.CUSTOM,
    classes = {TypeExcludeFilter.class}
), @Filter(
    type = FilterType.CUSTOM,
    classes = {AutoConfigurationExcludeFilter.class}
)}
)
public @interface SpringBootApplication {
    // 忽略具体业务参数信息
}
```

> [!NOTE]
>
> 该注解由四个元注解（`Target`、`Retention`、`Document`、`InHerited`）和三个注解（`SpringBootConfiguration`、`EnableAutoConfiguration`、`ComponentScan`）组成。



#### @SpringBootConfiguration

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Configuration
@Indexed
public @interface SpringBootConfiguration {
    @AliasFor(
        annotation = Configuration.class
    )
    boolean proxyBeanMethods() default true;
}
```

> [!NOTE]
>
> 除了元注解之外，它仅仅被`@Configuration`注解所标注，**`@SpringBootConfiguration`是一个配置类**。

##### @Configuration

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component
public @interface Configuration {
    @AliasFor(
        annotation = Component.class
    )
    String value() default "";

    boolean proxyBeanMethods() default true;
}
```

> [!TIP]
>
> **@Configuration**：该注解为Spring中的配置类注解，其中被@Component标注为Spring组件，该类被注册到IOC容器。
>
> 使用**@Component注解**在一个类上，表示将此类标记为Spring容器中的一个Bean，

#### **@EnableAutoConfiguration(自动配置有关的核心注解，主要分析)**

```java
 @Target(ElementType.TYPE)
 @Retention(RetentionPolicy.RUNTIME)
 @Documented
 @Inherited
 @AutoConfigurationPackage
 @Import(AutoConfigurationImportSelector.class)//自动配置的引入选择器实现
 public @interface EnableAutoConfiguration {
    // 忽略具体业务参数信息
}
```

除了四个元注解，这个注解被两个注解所标注：

`@AutoConfigurationPackage`

`@Import(AutoConfigurationImportSelector.class)`

##### 自动配置包@AutoConfigurationPackage

```java
@Target(ElementType.TYPE)
 @Retention(RetentionPolicy.RUNTIME)
 @Documented
 @Inherited
 @Import(AutoConfigurationPackages.Registrar.class)
 public @interface AutoConfigurationPackage {
    // 忽略具体业务参数信息
}
```

`@AutoConfigurationPackage`中使用注解`@Import`导入了AutoConfigurationPackages.Registrar.class到容器中，分析这个类，进入到这个内部类**Regisrar：**

```java
static class Registrar implements ImportBeanDefinitionRegistrar, DeterminableImports {
        public void registerBeanDefinitions(AnnotationMetadata metadata, BeanDefinitionRegistry registry) {
            AutoConfigurationPackages.register(registry, (String[])(new PackageImports(metadata)).getPackageNames().toArray(new String[0]));
        }

  			// 该方法用于确定导入的内容
        public Set<Object> determineImports(AnnotationMetadata metadata) {
            return Collections.singleton(new PackageImports(metadata));
        }
    }
```

该类引入的重点在于方法**`registerBeanDefinitions()`：**

```java
public void registerBeanDefinitions(AnnotationMetadata metadata, BeanDefinitionRegistry registry) {
         register(registry, new PackagesImports(metadata).getPackageNames().toArray(new String[0]));
 }
```

- 该方法的作用是将包路径注册到 Spring 容器中。         
- 通过 `AutoConfigurationPackages.register`方法，将从 `PackageImports(metadata)`中解析的包名数组注册到 `BeanDefinitionRegistry`中。          
- 具体逻辑：
  - `PackageImports(metadata)`会根据注解元数据 `metadata`提取包名。              
  - 提取的包名会被转换为数组并注册到容器中。 

##### 导入自动配置导入选择器@Import(AutoConfigurationImportSelector.class)

```java
public String[] selectImports(AnnotationMetadata annotationMetadata) {//selectImports方法会被springboot自动调用，从而得到他返回的全类名的字符串数组，然后把对应类的bean对象注入到ioc容器中
         if (!this.isEnabled(annotationMetadata)) {
             return NO_IMPORTS;
         } else {
             AutoConfigurationEntry autoConfigurationEntry = this.getAutoConfigurationEntry(annotationMetadata);
             return StringUtils.toStringArray(autoConfigurationEntry.getConfigurations());
         }
     }
```

- **参数：**
  - annotationMetadata`**：表示当前类的注解元数据，包含了类上的注解信息。   
- **功能：**   
  1. **检查是否启用自动配置**：
     1. 调用 `isEnabled(annotationMetadata)`方法，判断自动配置功能是否被启用。          
     2. 如果未启用，返回一个空的字符串数组。
  2. **获取自动配置类**：
     1. 调用 `getAutoConfigurationEntry(annotationMetadata)`方法，获取自动配置的类列表和排除的类列表。
  3. **转换为数组**：
     1. 使用 `StringUtils.toStringArray`将自动配置类列表转换为字符串数组并返回。
- **返回值：**
  - 返回一个字符串数组，包含需要导入的自动配置类的全限定类名。

#### **@ComponentScan（包扫描）**

`@ComponentScan` 注解的作用是指定 Spring 容器在启动时扫描的包路径，从而自动发现和注册标注了特定注解（如 `@Component`、`@Service`、`@Repository`、`@Controller` 等）的类为 Spring 的 Bean。

##### 主要功能：

1. **自动扫描组件**：扫描指定包及其子包中的类，自动将符合条件的类注册为 Spring 容器中的 Bean。
2. **过滤机制**：通过 `includeFilters` 和 `excludeFilters` 属性，可以指定哪些类需要被包含或排除。
3. **自定义扫描路径**：通过 `basePackages` 或 `basePackageClasses` 属性，指定需要扫描的包路径。

##### 常用属性：

- **`basePackages`**：指定需要扫描的包路径，默认扫描当前类所在包及其子包。
- **`basePackageClasses`**：指定需要扫描的类，Spring 会扫描这些类所在的包。
- **`includeFilters`**：指定需要包含的过滤规则。
- **`excludeFilters`**：指定需要排除的过滤规则。

##### 参考代码：

```java
@ComponentScan(
    basePackages = "com.example.project",
    excludeFilters = @ComponentScan.Filter(type = FilterType.ANNOTATION, classes = Deprecated.class)
)
public class AppConfig {
    // 配置类内容
}
```

> 上述代码会扫描 `com.example.project` 包及其子包，但会排除标注了 `@Deprecated` 注解的类。

###### 在当前代码中的作用：

选中的代码通过 `excludeFilters` 属性排除了 `TypeExcludeFilter` 和 `AutoConfigurationExcludeFilter`，避免这些类被扫描和注册为 Bean。

