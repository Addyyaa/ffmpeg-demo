const express = require('express');
const app = express();

app.use((req, res, next) => {
    // 设置响应头
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('Cache-Control', 'no-store'); // 或设置为其他策略
    
    // 调用 next() 使请求继续执行
    next();
});

module.exports = app;