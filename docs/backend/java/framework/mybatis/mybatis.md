# Mybatis等相关衍生框架

## Mybatis

- Mybatis 配置

```yaml
# 配置mybatis所有Mapper.xml所在的路径
mybatis:
  mapper-locations: classpath:/mapper/**/*.xml


# 打印所有的sql日志：sql, 参数, 结果
logging:
  level:
    com:
      asset:
        member:
          mapper: debug  # 打印 MyBatis Mapper 的 SQL 日志
    org:
      apache:
        ibatis: debug  # 打印 MyBatis 内部执行的 SQL 语句
    org.mybatis: debug  # 打印 MyBatis 执行的 SQL
    com.github.pagehelper: debug  # 打印 PageHelper 的 SQL 执行日志
    # 打印 SQL 参数，帮助查看是否传递了正确的查询参数
    org.springframework.jdbc.core: debug  # 用于查看通过 JDBC 执行的 SQL 及其参数

pagehelper:
  # 使用 MySQL 数据库
  helperDialect: mysql
  # 设置合理化
  reasonable: true
  # 支持方法参数
  support-methods-arguments: true
```