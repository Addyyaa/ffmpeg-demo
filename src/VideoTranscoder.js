import React, { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

/*************  ✨ Codeium AI 建议  *************/
/**
 * 一个用于视频转码的React函数组件。
 * 
 * 该组件允许用户上传视频文件，选择裁剪比例，
 * 并使用FFmpeg对视频进行转码。
 * 
 * @return {JSX.Element} 表示视频转码器组件的JSX元素
 */
/****  bot-b85ceea4-25a9-46ab-8e22-9be04a2e8912  *****/
function VideoTranscoder() {
    const [loaded, setLoaded] = useState(false);
    const [progress, setProgress] = useState(0);
    const [cropParams, setCropParams] = useState('crop=1280:720:0:0'); // 默认裁剪参数
    const [cropBox, setCropBox] = useState({ x: 0, y: 0, width: 100, height: 100});
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef(null);
    const messageRef = useRef(null);
    const loadingRef = useRef(null);
    const videoContainerRef = useRef(null); // 视频容器的引用
    const [isResizing, setIsResizing] = useState(false); // 新增状态标识
    const [isDragging, setIsDragging] = useState(false);
    const [isVideoSelected, setIsVideoSelected] = useState(false);
    const saveButton = document.getElementById('saveButton');


    /**
     * 从给定的 URL 创建一个 blob URL。
     *
     * @param {string} url - 要获取并转换为 blob URL 的 URL。
     * @param {string} type - blob 的类型（在此实现中未使用）。
     * @return {string} 返回的 blob URL。
     */
    const toBlobURL = async (url, type) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    };

    // 裁剪比例配置
    const cropOptions = {
        "16:10": "crop=1152:720:10:10",
        "10:16": "crop=720:1152:10:10",
        "16:9": "crop=1280:720:10:10",
        "9:16": "crop=720:1280:10:10",
        "4:3": "crop=960:720:10:10",
        "3:4": "crop=720:960:10:10",
        "1:1": "crop=720:720:10:10",
        "自由裁剪": "自由裁剪参数"
    };

    /**
     * 异步加载 FFmpeg 核心，并设置加载进度。
     *
     * @async
     * @return {Promise<void>}
     */
    const load = async () => {
        try {
            console.log("开始加载 FFmpeg 核心...");
            const ffmpeg = ffmpegRef.current;
            await ffmpeg.load();
            setLoaded(true);
            console.log("FFmpeg 核心已加载");
            
            ffmpeg.on('progress', ({ ratio }) => {
                setProgress(ratio * 100);
            });
        } catch (error) {
            console.error("加载 FFmpeg 核心失败:", error);
        }
    };

    /**
     * 异步执行视频转码，包括检查视频文件、裁剪区域、执行转码和更新进度。
     *
     * @async
     * @return {Promise<void>}
     */
    const transcode = async () => {
        const ffmpeg = ffmpegRef.current;
        const upload = document.getElementById('upload');
        
        if (upload.files.length === 0) {
            alert("请先上传一个视频文件。");
            return;
        }

        loadingRef.current.style.display = "block";
        setProgress(0);
        ffmpeg.on('progress', ({ progress, time }) => {
            const progressValue = progress * 100;
            console.log("Current progress:", progress);
            // messageRef.current.innerHTML = ${(progress * 100).toFixed(2)} % (transcoded time: ${time / 1000000} s);
            setProgress(progressValue);
            const progressBar = document.querySelector('progress');
            progressBar.style.backgroundColor = updateProgressBarColor(progress); // 更新进度条颜色
        });
        await ffmpeg.writeFile('input.mp4', await fetchFile(upload.files[0]));
        try{
            messageRef.current.innerHTML += "<div>开始裁剪...</div>";
        
        await ffmpeg.exec(['-i', 'input.mp4', '-vf', cropParams, '-c:v', 'libx264', '-c:a', 'aac', '-preset', 'ultrafast', '-r', '30', '-b:v', '3000k' , 'output.mp4']);
        ffmpeg.off('progress');

        const data = await ffmpeg.readFile('output.mp4');
        videoRef.current.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

        loadingRef.current.style.display = "none";
        setProgress(100);
        messageRef.current.innerHTML += "<div>转码完成！</div>";
        
        // 隐藏裁剪框
        setCropBox(null);
        } catch (error) {
            console.error("转码失败:", error);
            messageRef.innerHTML += "<div>转码失败，请重试。</div>";
        } finally {
            ffmpegRef.current.off('progress');
        }
    };

    const saveVideo = () => {
        if (progress !== 100) {
            alert("视频未转码完成，请等待转码完成后再保存。");
            return;
        }
        const url = videoRef.current.src;
        console.log(url, videoRef);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Cropped_Video.mp4';
        a.click();
    };


/*************  document  *************/
    /**
     * 根据给定的进度值更新进度条颜色。
     *
     * @param {number} progress - 范围在0到1之间的进度值。
     * @return {string} 以字符串形式表示的RGB颜色值。
     */
/****  bot-1693e943-4216-4b4a-bd46-7246754af103  *****/
    const updateProgressBarColor = (progress) => {
        const greenValue = Math.floor(progress * 255);// 计算绿色值
        return `rgb(0, ${greenValue}, 0)`;
    };

/*************  ✨ Codeium AI 建议  *************/
    /**
     * 为视频选择裁剪比例，并相应地更新裁剪框。
     *
     * @param {string} option - 选定的裁剪比例（例如："16:10", "1:1", "自由裁剪"）
     * @return {void}
     */
/****  bot-0394ff2d-88b6-4c1e-8676-b0c0bd738ce9  *****/
    const selectCrop = (option) => {
        const video = videoRef.current;
        const videoRect = video.getBoundingClientRect(); // 获取视频的宽高
        console.log(videoRect);
        // 根据视频的实际宽高调整裁剪框尺寸
        const { width: videoWidth, height: videoHeight } = videoRect;
    
        let newWidth, newHeight;
    
        switch (option) {
            case "16:10":
                newWidth = videoWidth * 0.9;
                newHeight = (newWidth / 16) * 10;
                break;
            case "10:16":
                newHeight = videoHeight * 0.9;
                newWidth = (newHeight / 16) * 10;
                break;
            case "16:9":
                newWidth = videoWidth * 0.9;
                newHeight = (newWidth / 16) * 9;
                break;
            case "9:16":
                newHeight = videoHeight * 0.9;
                newWidth = (newHeight / 16) * 9;
                break;
            case "4:3":
                newWidth = videoWidth * 0.9;
                newHeight = (newWidth / 4) * 3;
                break;
            case "3:4":
                newHeight = videoHeight * 0.9;
                newWidth = (newHeight / 4) * 3;
                break;
            case "1:1":
                newWidth = newHeight = Math.min(videoWidth, videoHeight) * 0.9;
                break;
            case "自由裁剪":
                // 保持自由裁剪框的大小
                return;
            default:
                return;
        }
        setCropBox({
            x: Math.max(0, (videoWidth - newWidth) / 2),
            y: Math.max(0, (videoHeight - newHeight) / 2),
            width: newWidth,
            height: newHeight
        });

            // 更新裁剪框的大小和位置，确保不超出视频区域
};

    // 动态更新裁剪参数
    useEffect(() => {
        if (cropBox === null) {
            return
        }
        const newCropParams = `crop=${cropBox.width}:${cropBox.height}:${cropBox.x}:${cropBox.y}`;
        setCropParams(newCropParams);
    }, [cropBox]);

    // 监听鼠标按下，允许裁剪框的移动
    const handleMouseDown = (e) => {
        setIsDragging(true);
        if (e.target.className.includes('resize-handle')) {
            e.preventDefault(); // 防止文本选择
            document.addEventListener('mousemove', handleResize);
        } else {
            const offsetX = e.clientX - cropBox.x;
            const offsetY = e.clientY - cropBox.y;
            
/*************  ✨ Codeium AI 建议  *************/
            /**
             * 根据鼠标移动更新裁剪框的位置。
             *
             * @param {MouseEvent} moveEvent - 鼠标移动事件。
             * @return {void}
             */
/****  bot-338e1a15-0b1a-4b8a-a01c-9950b424db59  *****/
            const handleMouseMove = (moveEvent) => {
                const containerRect = videoContainerRef.current.getBoundingClientRect();
                console.log(containerRect.width, containerRect.height);
                const newX = Math.max(0, Math.min(moveEvent.clientX - offsetX, containerRect.width - cropBox.width));
                const newY = Math.max(0, Math.min(moveEvent.clientY - offsetY, containerRect.height - cropBox.height));
    
                setCropBox(prev => ({
                    ...prev,
                    x: newX,
                    y: newY
                }));
            };
    
/*************  ✨ Codeium AI 建议  *************/
            /**
             * 移除鼠标移动和鼠标释放的事件监听器。
             *
             * @return {void}
             */
/****  bot-ebdb87d3-afee-4357-a3aa-56e515d28777  *****/
            const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
    
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
    };
    
    
    


    
    // 监听鼠标调整大小，允许裁剪框的大小调整
    const handleResize = (e) => {
        e.stopPropagation(); // 防止触发裁剪框移动事件
    
        const startX = e.clientX;
        const startY = e.clientY;
        const initialWidth = cropBox.width;
        const initialHeight = cropBox.height;
        const aspectRatio = initialWidth / initialHeight;
    
        const handleMouseMove = (moveEvent) => {
            const containerRect = videoContainerRef.current.getBoundingClientRect();
            const deltaX = moveEvent.clientX - startX;

    
            // 计算新的宽度和高度，始终保持等比例
            let newWidth = initialWidth + deltaX;
            let newHeight = newWidth / aspectRatio;
            console.log(containerRect.height, containerRect.width);
            // 如果新的高度超出容器高度，限制高度并重新计算宽度
            if (cropBox.y + newHeight > containerRect.height) {
                newHeight = containerRect.height - cropBox.y;
                newWidth = newHeight * aspectRatio;
            }
    
            // 如果新的宽度超出容器宽度，限制宽度并重新计算高度
            if (cropBox.x + newWidth > containerRect.width) {
                newWidth = containerRect.width - cropBox.x;
                newHeight = newWidth / aspectRatio;
            }

            // 检查是否已达到边界，限制调整方向
            const widthAtBoundary = cropBox.x + newWidth <= containerRect.width;
            const heightAtBoundary = cropBox.y + newHeight <= containerRect.height;

            // 继续拖拉时，确保不超过边界
            if (!widthAtBoundary) {
                newWidth = containerRect.width - cropBox.x; // 限制宽度
                newHeight = newWidth / aspectRatio; // 重新计算高度
            }

            if (!heightAtBoundary) {
                newHeight = containerRect.height - cropBox.y; // 限制高度
                newWidth = newHeight * aspectRatio; // 重新计算宽度
            }
    
            // 限制最小宽高，避免裁剪框消失
            newWidth = Math.max(newWidth, 50); // 假设最小宽度50px
            newHeight = Math.max(newHeight, 50); // 假设最小高度50px
    
            // 更新裁剪框大小
            setCropBox(prev => ({
                ...prev,
                width: newWidth,
                height: newHeight
            }));
        };
    
/*************  ✨ Codeium AI 建议  *************/
        /**
         * 移除鼠标移动和鼠标释放的事件监听器。
         *
         * @return {void}
         */
/****  bot-557bc313-c89e-4fb5-b581-7e0b2d92780e  *****/
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };
    
    

    
    
    

    /**
     * 处理文件选择事件，更新视频源并重新加载视频。
     *
     * @param {Event} event - 文件选择事件
     * @return {void}
     */
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            const video = videoRef.current;
    
            // 设置视频src
            video.src = fileUrl;
    
            // 确保视频重新加载
            video.load();
    
            // 监听视频的 loadedmetadata 事件
            video.addEventListener('loadedmetadata', () => {
                // 获取视频的实际宽高
                const videoWidth = video.videoWidth;
                const videoHeight = video.videoHeight;
    
                // 设置视频元素的宽高
                video.width = videoWidth;
                video.height = videoHeight;
    
                // 释放对象 URL
                video.addEventListener('ended', () => {
                    URL.revokeObjectURL(fileUrl);
                });
    
                // 更新状态，表示视频已选择
                setIsVideoSelected(true);
    
                // 设置裁剪框为 1:1 比例
                const containerRect = videoContainerRef.current.getBoundingClientRect();
                const containerWidth = containerRect.width;
                const containerHeight = containerRect.height;
                const newSize = Math.min(containerWidth, containerHeight) * 0.8; // 例如，设置为容器大小的80%
    
                // 计算裁剪框的位置，使其居中
                const x = (containerWidth - newSize) / 2;
                const y = (containerHeight - newSize) / 2;
    
                // 更新裁剪框的大小和位置
                setCropBox({
                    x: x,
                    y: y,
                    width: newSize,
                    height: newSize
                });
            });
        }
    };
    

    return (
        <div className="Cropper">
            <div className="crop-button">
                {/* 裁剪比例按钮 */}
                {isVideoSelected && (
                    <div className="crop-options">
                        {Object.keys(cropOptions).map((option) => (
                            <button
                                key={option}
                                onClick={() => selectCrop(option)}
                                className={`aspect-${option.replace(':', '-')}`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="container">
            <h1>视频转码器</h1>
    
            {!loaded ? (
                <button onClick={load}>加载 FFmpeg 核心</button>
            ) : (
                <>
                    <h2>组件已加载</h2>
                    <label htmlFor="upload">
                    <input
                        type="file"
                        id="upload"
                        accept="video/*"
                        className="upload-btn"
                        onChange={handleFileSelect}  // 添加文件选择事件处理
                    />
                    {isVideoSelected && (<button onClick={transcode}>裁剪视频</button>)}
                    {isVideoSelected && <button onClick={saveVideo}>下载视频</button>}
                    </label>
                    
    
                    <div ref={loadingRef} style={{ display: 'none' }}>处理中，请稍候...
                        <div className='progress_text'>
                        <progress 
                        value={isNaN(progress) ? 0 : progress} 
                        max="100" 
                        style={{ position: 'relative', width: '100%' }}
                    ></progress>
                        <span 
                            className="progress-percent"
                            // style={{
                            //     position: 'absolute',
                            //     left: `${progress}%`,
                            //     transform: 'translateX(-50%)', // 确保文本居中
                            // }}
                        >
                            {Math.round(progress)}%
                        </span>
                        </div>
                    </div>
                    
    
                    <div ref={videoContainerRef} style={{ display: 'flex', position: 'relative', justifyContent: 'center'}}>
                        {/* 视频标签 */}
                        <video ref={videoRef} controls className="video-player" />
    
                        {/* 裁剪框 */}
                        {cropBox !== null && isVideoSelected && (
                            <div
                                className="crop-box"
                                style={{
                                    position: 'absolute',
                                    left: cropBox.x,
                                    top: cropBox.y,
                                    width: cropBox.width,
                                    height: cropBox.height,
                                    border: '2px dashed red',
                                    cursor: 'move',
                                }}
                                onMouseDown={handleMouseDown}
                            >
                                <div
                                    className="resize-handle"
                                    style={{
                                        position: 'absolute',
                                        right: 0,
                                        bottom: 0,
                                        width: '10px',
                                        height: '10px',
                                        backgroundColor: 'blue',
                                        cursor: 'nwse-resize',
                                    }}
                                    onMouseDown={handleResize}
                                />
                            </div>
                        )}
                    </div>
    
                    <p ref={messageRef}></p>
    
                </>
            )}
            </div>
        </div>
    );
    
}

export default VideoTranscoder;
