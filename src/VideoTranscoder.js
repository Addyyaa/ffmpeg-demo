import React, { useState, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

function VideoTranscoder() {
    const [loaded, setLoaded] = useState(false);
    const [progress, setProgress] = useState(0);
    const ffmpegRef = useRef(new FFmpeg());
    const videoRef = useRef(null);
    const messageRef = useRef(null);
    const loadingRef = useRef(null);
    const toBlobURL = async (url, type) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    };
    
    const load = async () => {
        try {
            console.log("开始加载 FFmpeg 核心...");
    
            const ffmpeg = ffmpegRef.current;


            // ffmpeg.on('log', ({ message }) => {
            //     messageRef.current.innerHTML += <div>${message}</div>;
            // });

            
            await ffmpeg.load();
            console.log("FFmpeg 核心已加载，loaded 状态:", loaded);
            setLoaded(true);
            console.log("FFmpeg 核心已加载，loaded 状态:", true); // 打印更新后的状态
            // 只在这里设置一次进度监听器
            ffmpeg.on('progress', ({ ratio }) => {
                setProgress(ratio * 100); // ratio 是范围 0-1
            });
            

        } catch (error) {
            console.error("加载 FFmpeg 核心失败:", error);
        }
    };

    const transcode = async () => {
        const ffmpeg = ffmpegRef.current;
        const upload = document.getElementById('upload');
        
        if (upload.files.length === 0) {
            alert("请先上传一个视频文件。");
            return;
        }

        loadingRef.current.style.display = "block";
        setProgress(0);
        // Listen to progress event
        ffmpeg.on('progress', ({ progress, time }) => {
            const progressValue = progress * 100;
            console.log("Current progress:", progress);
            // messageRef.current.innerHTML = ${(progress * 100).toFixed(2)} % (transcoded time: ${time / 1000000} s);
            setProgress(progressValue);
            const progressBar = document.querySelector('progress');
            progressBar.style.backgroundColor = updateProgressBarColor(progress); // 更新进度条颜色
        });

        // 写入文件
        await ffmpeg.writeFile('input.mp4', await fetchFile(upload.files[0]));
        messageRef.current.innerHTML += "<div>开始裁剪...</div>";

        // 执行转码操作
        await ffmpeg.exec(['-i', 'input.mp4', '-vf', 'crop=640:480:10:10', 'output.mp4']);
        // 移除进度监听器（可选）
        ffmpeg.off('progress');

        const data = await ffmpeg.readFile('output.mp4');
        videoRef.current.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));

        loadingRef.current.style.display = "none";
        setProgress(100);
        messageRef.current.innerHTML += "<div>转码完成！</div>";
    };

    const updateProgressBarColor = (progress) => {
        const greenValue = Math.floor(progress * 255); // 计算绿色值
        return `rgb(0, ${greenValue}, 0)`;
    };

    return (
        <div className="container">
            <h1>视频转码器</h1>
            
            {!loaded ? (
                <button onClick={load}>加载 FFmpeg 核心</button>
            ) : (
                <>
                    <h2>组件已加载</h2>
                    <input
                        type="file"
                        id="upload"
                        accept="video/*"
                        className="upload-btn"
                    />
                    <button onClick={transcode}>
                        裁剪视频
                    </button>
                    <div ref={loadingRef} style={{ display: 'none' }}>处理中，请稍候...</div>
                    <progress 
                        value={isNaN(progress) ? 0 : progress} 
                        max="100" 
                    ></progress>
                    <video className="video_frame" ref={videoRef} controls></video>
                    <p ref={messageRef}></p>
                </>
            )}
        </div>
    );
    
      
}

export default VideoTranscoder;