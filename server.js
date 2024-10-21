const express = require('express');
const path = require('path');

const app = express();

// 添加响应头
app.use((req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('Cache-Control', 'no-store'); // 或设置为其他策略
    next();
});

// 设置静态文件夹
app.use(express.static(path.join(__dirname, 'public'))); // 假设你的文件在 public 文件夹中

// 启动服务器
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
