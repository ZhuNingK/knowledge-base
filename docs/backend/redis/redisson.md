# Redisson

## 官方文档

- [Redisson 官方文档](https://redisson.pro/)

## 配置方法

- 引入pom：

```xml
<!--     springboot.version 2.3.0 及以上版本 -->
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson</artifactId>
    <version>3.17.0</version>
</dependency>
```

```xml
    <!--     springboot.version 3.0.0 以上版本 -->
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson-spring-boot-starter</artifactId>
    <version>3.24.3</version>
</dependency>
```

### 程序配置方法

#### application.yml

- springboot 2.x 版本

```yaml
spring:
  redis:
    host: localhost
    port: 6379
    password:
    database: 0
    timeout: 30000
```

- springboot 3.x 版本

```yaml
spring:
  data:
    redis:
      host: localhost
      port: 6379
      password:
      database: 0
      timeout: 30000
```

#### Java 配置

```java

@Configuration
public class RedissonConfig {

    @Value("${spring.data.redis.host:127.0.0.1}")
    private String url;
    @Value("${spring.data.redis.password:}")
    private String password;
    @Value("${spring.data.redis.port:6379}")
    private Integer port;
    @Value("${spring.data.redis.database:0}")
    private Integer database;

    /**
     * 对 Redisson 的使用都是通过 RedissonClient 对象
     *
     * @return RedissonClient
     */
    @Bean(name = "redissonClient", destroyMethod = "shutdown") // 服务停止后调用 shutdown 方法
    @Primary
    public RedissonClient redissonClient() {
        // 1、创建配置
        Config config = new Config();
        // 2、集群模式
        // config.useClusterServers()
        // .addNodeAddress("127.0.0.1:6379", "127.0.0.1:7379")
        // .addNodeAddress( "127.0.0.1:8379");
        // 根据 Config 创建出 RedissonClient 示例
        config.useSingleServer()
                .setPassword(!StringUtils.hasText(password) ? null : password)
                .setAddress(String.format("redis://%s:%s", url, port))
                .setDatabase(database)
                .setTimeout(3000)
                .setConnectionMinimumIdleSize(10)
                .setConnectionPoolSize(50);
        return Redisson.create(config);

    }
}

```

## 使用 Redisson

- Redisson 的使用都是通过 `RedissonClient` 对象
- `RedissonClient` 提供了对 Redis 各种数据结构的支持，如字符串、哈希、列表、集合、有序集合等。
- 还支持分布式锁、分布式集合、分布式队列等高级功能。

### 获取 RedissonClient 对象

```java

@Resource
private RedissonClient redissonClient;
```

### redissonClient 常用方法

- `getBucket(String name)`：获取一个字符串对象。
- `getMap(String name)`：获取一个哈希对象。
- `getList(String name)`：获取一个列表对象。
- `getSet(String name)`：获取一个集合对象。
- `getSortedSet(String name)`：获取一个有序集合对象。
- `getLock(String name)`：获取一个分布式锁对象。
- `getAtomicLong(String name)`：获取一个分布式原子长整型对象。
- `getTopic(String name)`：获取一个发布/订阅主题对象。
- `getQueue(String name)`：获取一个分布式队列对象。

### Redisson 看门狗

:::tip

- 普通的Redis分布式锁的缺陷
- 如果业务处理时间超过锁的过期时间，锁会自动过期并被删除，导致其他线程可以获取到锁，从而引发数据不一致的问题。
- Redisson的看门狗机制
- Redisson的看门狗机制会在锁即将过期时自动延长锁的过期时间，确保锁在业务处理完成之前不会被删除。
  :::

![redisson加锁机制](/public/docs/backend/redisson/redisson-lock.png)

Redisson 锁的加锁机制如上图所示，线程去获取锁，获取成功则执行lua脚本，保存数据到redis数据库。如果获取失败:
一直通过while循环尝试获取锁(可自定义等待时间，超时后返回失败)
，获取成功后，执行lua脚本，保存数据到redis数据库。Redisson提供的分布式锁是支持锁自动续期的，也就是说，如果线程仍旧没有执行完，那么redisson会自动给redis中的目标key延长超时时间，这在Redisson中称之为
Watch Dog 机制。同时 redisson 还有公平锁、读写锁的实现。

```java
public void test() throws Exception {
    RLock lock = redissonClient.getLock("guodong");    // 拿锁失败时会不停的重试
    // 具有Watch Dog 自动延期机制 默认续30s 每隔30/3=10 秒续到30s
    lock.lock();
    // 尝试拿锁10s后停止重试,返回false 具有Watch Dog 自动延期机制 默认续30s
    boolean res1 = lock.tryLock(10, TimeUnit.SECONDS);
    // 没有Watch Dog ，10s后自动释放
    lock.lock(10, TimeUnit.SECONDS);
    // 尝试拿锁100s后停止重试,返回false 没有Watch Dog ，10s后自动释放
    boolean res2 = lock.tryLock(100, 10, TimeUnit.SECONDS);
    Thread.sleep(40000L);
    lock.unlock();
}
```

#### Wath Dog的自动延期机制

>
如果拿到分布式锁的节点宕机，且这个锁正好处于锁住的状态时，会出现锁死的状态，为了避免这种情况的发生，锁都会设置一个过期时间。这样也存在一个问题，加入一个线程拿到了锁设置了30s超时，在30s后这个线程还没有执行完毕，锁超时释放了，就会导致问题，Redisson给出了自己的答案，就是
> watch dog 自动延期机制。
> Redisson提供了一个监控锁的看门狗，它的作用是在Redisson实例被关闭前，不断的延长锁的有效期，也就是说，如果一个拿到锁的线程一直没有完成逻辑，那么看门狗会帮助线程不断的延长锁超时时间，锁不会因为超时而被释放。
> 默认情况下，看门狗的续期时间是30s，也可以通过修改Config.lockWatchdogTimeout来另行指定。另外Redisson
> 还提供了可以指定leaseTime参数的加锁方法来指定加锁的时间。超过这个时间后锁便自动解开了，不会延长锁的有效期。

- atchDog 只有在未显示指定加锁时间（leaseTime）时才会生效。（这点很重要）
- lockWatchdogTimeout设定的时间不要太小 ，比如我之前设置的是 100毫秒，由于网络直接导致加锁完后，watchdog去延期时，这个key在redis中已经被删除了。
  在调用lock方法时，会最终调用到tryAcquireAsync。调用链为：lock()->tryAcquire->tryAcquireAsync,详细解释如下：

> 在调用lock方法时，会最终调用到tryAcquireAsync。调用链为：lock()->tryAcquire->tryAcquireAsync,详细解释如下：

```java
private <T> RFuture<Long> tryAcquireAsync(long waitTime, long leaseTime, TimeUnit unit, long threadId) {
    RFuture<Long> ttlRemainingFuture;
    //如果指定了加锁时间，会直接去加锁
    if (leaseTime != -1) {
        ttlRemainingFuture = tryLockInnerAsync(waitTime, leaseTime, unit, threadId, RedisCommands.EVAL_LONG);
    } else {
        //没有指定加锁时间 会先进行加锁，并且默认时间就是 LockWatchdogTimeout的时间
        //这个是异步操作 返回RFuture 类似netty中的future
        ttlRemainingFuture = tryLockInnerAsync(waitTime, internalLockLeaseTime,
                TimeUnit.MILLISECONDS, threadId, RedisCommands.EVAL_LONG);
    }

    //这里也是类似netty Future 的addListener，在future内容执行完成后执行
    ttlRemainingFuture.onComplete((ttlRemaining, e) -> {
        if (e != null) {
            return;
        }

        // lock acquired
        if (ttlRemaining == null) {
            // leaseTime不为-1时，不会自动延期
            if (leaseTime != -1) {
                internalLockLeaseTime = unit.toMillis(leaseTime);
            } else {
                //这里是定时执行 当前锁自动延期的动作,leaseTime为-1时，才会自动延期
                scheduleExpirationRenewal(threadId);
            }
        }
    });
    return ttlRemainingFuture;
}
```

> scheduleExpirationRenewal 中会调用renewExpiration。 这里我们可以看到是,启用了一个timeout定时，去执行延期动作

```java
private void renewExpiration() {
    ExpirationEntry ee = EXPIRATION_RENEWAL_MAP.get(getEntryName());
    if (ee == null) {
        return;
    }

    Timeout task = commandExecutor.getConnectionManager().newTimeout(new TimerTask() {
        @Override
        public void run(Timeout timeout) throws Exception {
            ExpirationEntry ent = EXPIRATION_RENEWAL_MAP.get(getEntryName());
            if (ent == null) {
                return;
            }
            Long threadId = ent.getFirstThreadId();
            if (threadId == null) {
                return;
            }

            RFuture<Boolean> future = renewExpirationAsync(threadId);
            future.onComplete((res, e) -> {
                if (e != null) {
                    log.error("Can't update lock " + getRawName() + " expiration", e);
                    EXPIRATION_RENEWAL_MAP.remove(getEntryName());
                    return;
                }

                if (res) {
                    //如果 没有报错，就再次定时延期
                    // reschedule itself
                    renewExpiration();
                } else {
                    cancelExpirationRenewal(null);
                }
            });
        }
        // 这里我们可以看到定时任务 是 lockWatchdogTimeout 的1/3时间去执行 renewExpirationAsync
    }, internalLockLeaseTime / 3, TimeUnit.MILLISECONDS);

    ee.setTimeout(task);
}
```

> 最终 scheduleExpirationRenewal会调用到 renewExpirationAsync，执行下面这段 lua脚本。他主要判断就是 这个锁是否在redis中存在，如果存在就进行
> pexpire 延期。

```java
protected RFuture<Boolean> renewExpirationAsync(long threadId) {
    return evalWriteAsync(getRawName(), LongCodec.INSTANCE, RedisCommands.EVAL_BOOLEAN,
            "if (redis.call('hexists', KEYS[1], ARGV[2]) == 1) then " +
                    "redis.call('pexpire', KEYS[1], ARGV[1]); " +
                    "return 1; " +
                    "end; " +
                    "return 0;",
            Collections.singletonList(getRawName()),
            internalLockLeaseTime, getLockName(threadId));
}
```

- 总结
    - watch dog 在当前节点存活时每10s给分布式锁的key续期 30s；
    - watch dog 机制启动，且代码中没有释放锁操作时，watch dog 会不断的给锁续期；
    - 如果程序释放锁操作时因为异常没有被执行，那么锁无法被释放，所以释放锁操作一定要放到 finally {} 中；
    - 要使 watchLog机制生效 ，lock时 不要设置 过期时间
    - watchlog的延时时间 可以由 lockWatchdogTimeout指定默认延时时间，但是不要设置太小。如100
    - watchdog 会每 lockWatchdogTimeout/3时间，去延时。
    - watchdog 通过 类似netty的 Future功能来实现异步延时
    - watchdog 最终还是通过 lua脚本来进行延时