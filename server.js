const express = require('express');
const path = require('path');

const app = express();

// 添加响应头
app.use((req, res, next) => {
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('Cache-Control', 'no-store'); // 或设置为其他策略
    next();
});

// 设置静态文件夹，并根据文件类型设置不同的 Cache-Control
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        const extname = path.extname(path);
        
        if (extname === '.js' || extname === '.css') {
            // 对于 JS 和 CSS 文件，设置较长的缓存时间
            res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30天
        } else if (extname === '.png' || extname === '.jpg' || extname === '.jpeg' || extname === '.gif') {
            // 对于图片文件，设置较长的缓存时间
            res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30天
        } else if (extname === '.html') {
            // 对于 HTML 文件，设置较短的缓存时间，以便快速更新
            res.setHeader('Cache-Control', 'no-store'); // 不缓存
        } else {
            // 对于其他文件，设置较短的缓存时间
            res.setHeader('Cache-Control', 'no-store'); // 不缓存
        }
    }
}));

// 启动服务器
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
