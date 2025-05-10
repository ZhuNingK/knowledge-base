# 登录认证

## 登录方法

### 登录验证

#### 验证码校验

```java
// 获取验证码开启配置
// 判断验证码配置是否开启
if (验证码配置为开启) {
    // 根据验证码 uuid 从 Redis 中获取验证码参数
    // 判断验证码是否为空
    if (redisCaptcha == null) {
        // 如果为空抛出异常
        throw new CaptchaExpiredException("验证码已过期")
    }
    // 根据 uuid 删除 Redis 中验证码数据
    // 判断登录验证码参数与 Redis 中验证码是否一致
    if (用户输入的验证码 != redisCaptcha) {
        throw new CaptchaMismatchException("验证码不正确")
    }
}
```

#### 登录前置校验

```java
// 用户名或密码为空 错误
// 密码如果不在指定范围内 错误
// 用户名不在指定范围内 错误
// IP黑名单校验
```

#### 用户验证

`authenticationManager.authenticate(authenticationToken)` 方法会调用 `UserDetailsServiceImpl.loadUserByUsername`，是因为 Spring Security 的认证流程中，`AuthenticationManager` 会委托 `AuthenticationProvider` 来进行认证，而默认的 `AuthenticationProvider` 是 `DaoAuthenticationProvider`。

`DaoAuthenticationProvider` 的核心逻辑是通过 `UserDetailsService` 加载用户信息。具体流程如下：

1. **创建 `UsernamePasswordAuthenticationToken`**:  
   代码中通过 `UsernamePasswordAuthenticationToken` 封装了用户名和密码。

2. **调用 `AuthenticationManager.authenticate`**:  
   `AuthenticationManager` 会将 `UsernamePasswordAuthenticationToken` 传递给 `DaoAuthenticationProvider`。

3. **调用 `UserDetailsService.loadUserByUsername`**:  
   `DaoAuthenticationProvider` 会调用 `UserDetailsService` 的实现类（如 `UserDetailsServiceImpl`）的 `loadUserByUsername` 方法，根据用户名加载用户信息（如密码、权限等）。

4. **验证密码**:  
   加载的用户信息会与传入的密码进行比对，完成认证。

因此，`authenticationManager.authenticate(authenticationToken)` 会触发 `UserDetailsServiceImpl.loadUserByUsername`，以获取用户的详细信息用于认证。

#### 记录登录信息

## 获取用户信息



## 获取路由信息