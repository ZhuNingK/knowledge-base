# Minio 工具类

```java
/**
 * 文件操作工具类
 */
@RequiredArgsConstructor
@Component
@Slf4j
public class MinioUtil {

    private final MinioProperties minioProperties;
    private MinioClient minioClient;
    private String bucketName;

    private LocalDate retainSince = LocalDate.of(2025, 6, 1);//用于判断的起始时


    // 初始化 Minio 客户端
    @PostConstruct
    public void init() {
        try {
            //创建客户端
            minioClient = MinioClient.builder()
                    .endpoint(minioProperties.getUrl())
                    .credentials(minioProperties.getUsername(), minioProperties.getPassword())
                    .build();
            bucketName = minioProperties.getBucketName();

            // 检查桶是否存在，不存在则创建
            boolean bucketExists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(bucketName).build());
            if (!bucketExists) {
                minioClient.makeBucket(MakeBucketArgs.builder().bucket(bucketName).build());
            }
        } catch (Exception e) {
            throw new RuntimeException("Minio 初始化失败", e);
        }
    }

    /*
     * 上传文件
     */
    public String uploadFile(MultipartFile file, String extension) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("上传文件不能为空");
        }

        try {
            // 生成唯一文件名
            String uniqueFilename = generateUniqueFilename(extension);

            // 上传文件
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(uniqueFilename)
                    .stream(file.getInputStream(), file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build());

            return "/" + bucketName + "/" + uniqueFilename;
        } catch (Exception e) {
            throw new RuntimeException("文件上传失败", e);
        }
    }


    /**
     * 上传已处理的图片字节数组到 MinIO
     *
     * @param imageData   处理后的图片字节数组
     * @param extension   文件扩展名（如 ".jpg", ".png"）
     * @param contentType 文件 MIME 类型（如 "image/jpeg", "image/png"）
     * @return MinIO 中的文件路径（格式：/bucketName/yyyy-MM-dd/uuid.extension）
     */
    public String uploadFileByte(byte[] imageData, String extension, String contentType) {
        if (imageData == null || imageData.length == 0) {
            throw new RuntimeException("上传的图片数据不能为空");
        }
        if (extension == null || extension.isEmpty()) {
            throw new IllegalArgumentException("文件扩展名不能为空");
        }
        if (contentType == null || contentType.isEmpty()) {
            throw new IllegalArgumentException("文件 MIME 类型不能为空");
        }

        try {
            // 生成唯一文件名
            String uniqueFilename = generateUniqueFilename(extension);

            // 上传到 MinIO
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(uniqueFilename)
                            .stream(new ByteArrayInputStream(imageData), imageData.length, -1)
                            .contentType(contentType)
                            .build()
            );

            return "/" + bucketName + "/" + uniqueFilename;
        } catch (Exception e) {
            throw new RuntimeException("处理后的图片上传失败", e);
        }
    }

    /**
     * 上传本地生成的 Excel 临时文件到 MinIO
     *
     * @param localFile 本地临时文件路径
     * @param extension 扩展名
     * @return MinIO 存储路径，格式：/bucketName/yyyy-MM-dd/targetName
     */
    public String uploadLocalExcel(Path localFile, String extension) {
        if (localFile == null || !Files.exists(localFile)) {
            throw new RuntimeException("本地文件不存在");
        }
        try (InputStream in = Files.newInputStream(localFile)) {
            String objectKey = generateUniqueFilename(extension); // 保留日期目录
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(objectKey)
                            .stream(in, Files.size(localFile), -1)
                            .contentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                            .build());
            return "/" + bucketName + "/" + objectKey;
        } catch (Exception e) {
            throw new RuntimeException("Excel 上传失败", e);
        }
    }

    /*
     * 根据URL下载文件
     */
    public void downloadFile(HttpServletResponse response, String fileUrl) {
        if (fileUrl == null || !fileUrl.contains(bucketName + "/")) {
            throw new IllegalArgumentException("无效的文件URL");
        }

        try {
            // 从URL中提取对象路径和文件名
            String objectUrl = fileUrl.split(bucketName + "/")[1];
            String fileName = objectUrl.substring(objectUrl.lastIndexOf("/") + 1);

            // 设置响应头
            response.setContentType("application/octet-stream");
            String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8).replaceAll("\\+", "%20");
            response.setHeader("Content-Disposition", "attachment; filename=\"" + encodedFileName + "\"");

            // 下载文件
            try (InputStream inputStream = minioClient.getObject(GetObjectArgs.builder()
                    .bucket(bucketName)
                    .object(objectUrl)
                    .build());
                 OutputStream outputStream = response.getOutputStream()) {

                // 用IOUtils.copy高效拷贝（内部缓冲区默认8KB）
                IOUtils.copy(inputStream, outputStream);
            }
        } catch (Exception e) {
            throw new RuntimeException("文件下载失败", e);
        }
    }

    /**
     * 根据 MinIO 路径生成带签名的直链
     *
     * @param objectUrl 已存在的 MinIO 路径（/bucketName/...）
     * @param minutes   链接有效期（分钟）
     * @return 可直接访问的 HTTPS 下载地址
     */
    public String parseGetUrl(String objectUrl, int minutes) {
        if (objectUrl == null || !objectUrl.startsWith("/" + bucketName + "/")) {
            throw new IllegalArgumentException("非法的 objectUrl");
        }
        String objectKey = objectUrl.substring(("/" + bucketName + "/").length());
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucketName)
                            .object(objectKey)
                            .expiry(minutes, TimeUnit.MINUTES)
                            .build());
        } catch (Exception e) {
            throw new RuntimeException("生成直链失败", e);
        }
    }

    /*
     * 根据URL删除文件
     */
    public void deleteFile(String fileUrl) {
        try {
            // 从URL中提取对象路径
            String objectUrl = fileUrl.split(bucketName + "/")[1];
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(bucketName)
                    .object(objectUrl)
                    .build());
        } catch (Exception e) {
            throw new RuntimeException("文件删除失败", e);
        }
    }

    /*
     * 检查文件是否存在
     */
    public boolean fileExists(String fileUrl) {
        if (fileUrl == null || !fileUrl.contains(bucketName + "/")) {
            return false;
        }

        try {
            String objectUrl = fileUrl.split(bucketName + "/")[1];
            minioClient.statObject(StatObjectArgs.builder()
                    .bucket(bucketName)
                    .object(objectUrl)
                    .build());
            return true;
        } catch (Exception e) {
            if (e instanceof ErrorResponseException && ((ErrorResponseException) e).errorResponse().code().equals("NoSuchKey")) {
                return false;
            }
            throw new RuntimeException("检查文件存在失败", e);
        }
    }


    /**
     * 生成唯一文件名（带日期路径 + UUID）
     */
    private String generateUniqueFilename(String extension) {
        String dateFormat = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        String uuid = UUID.randomUUID().toString().replace("-", ""); // 去掉 UUID 中的 "-"
        return dateFormat + "/" + uuid + extension;
    }

    /**
     * 删除早于指定日期的所有日期目录（yyyy-MM-dd/）
     *
     * @param endExclusive 截止日期（不含）
     * @return 实际删除的对象总数
     */
    public int deleteDateFoldersBefore(LocalDate endExclusive) {
        if (endExclusive == null) {
            throw new IllegalArgumentException("指定日期不能为空");
        }

        LocalDate today = LocalDate.now();
        if (!endExclusive.isBefore(today)) {
            return 0;
        }
        int totalDeleted = 0;
        // 从 endExclusive-1 天开始往前删
        for (LocalDate d = endExclusive.minusDays(1); !d.isBefore(retainSince); d = d.minusDays(1)) {
            totalDeleted += deleteSingleFolder(d.format(DateTimeFormatter.ISO_LOCAL_DATE) + "/");
        }
        return totalDeleted;
    }

    /**
     * 删除单个目录（前缀）下的全部对象
     */
    private int deleteSingleFolder(String prefix) {
        try {
            List<DeleteObject> objects = new ArrayList<>();
            minioClient.listObjects(ListObjectsArgs.builder()
                            .bucket(bucketName)
                            .prefix(prefix)
                            .recursive(true)
                            .build())
                    .forEach(r -> {
                        try {
                            objects.add(new DeleteObject(r.get().objectName()));
                        } catch (Exception ignored) {
                            log.warn("文件名获取失败");
                        }
                    });
            if (objects.isEmpty()) {
                return 0;
            }
            Iterable<Result<DeleteError>> results = minioClient.removeObjects(
                    RemoveObjectsArgs.builder()
                            .bucket(bucketName)
                            .objects(objects)
                            .build());


            for (Result<DeleteError> res : results) {
                DeleteError deleteError = res.get();// 无异常即成功
            }
            return objects.size();
        } catch (Exception e) {
            log.warn("删除目录 {} 失败: {}", prefix, e.toString());
            return 0;
        }
    }
}
```