import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('cropBtn').onclick = async () => {
        const upload = document.getElementById('upload');
        if (upload.files.length === 0) {
            alert("请先上传一个视频文件。");
            return;
        }

        const ffmpeg = new FFmpeg();
        await ffmpeg.load(); // 确保 FFmpeg 被加载

        const file = upload.files[0];
        await ffmpeg.writeFile('input.mp4', await fetchFile(file));

        try {
            // 验证视频文件
            await ffmpeg.exec(['-i', 'input.mp4', '-f', 'null', '/dev/null']);
            
            // 执行裁剪命令
            await ffmpeg.exec(['-i', 'input.mp4', '-vf', 'crop=640:480', 'output.mp4']);

            const data = await ffmpeg.readFile('output.mp4');
            console.log(data); // 检查数据有效性

            const videoBlob = new Blob([data.buffer], { type: 'video/mp4' });
            const videoURL = URL.createObjectURL(videoBlob);

            // 撤销之前的 Blob URL（如果存在）
            const outputVideo = document.getElementById('outputVideo');
            if (outputVideo.src) {
                URL.revokeObjectURL(outputVideo.src);
            }
            outputVideo.src = videoURL;

        } catch (error) {
            console.error("处理视频时发生错误:", error);
            alert("处理视频时发生错误，请检查文件格式或编码。");
        }
    };
});
