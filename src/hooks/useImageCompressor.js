import { useCallback } from "react";
import imageCompression from "browser-image-compression";

const useImageCompressor = () => {
  const compressImages = useCallback(async (files, options = {}) => {
    const defaultOptions = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    const compressionOptions = { ...defaultOptions, ...options };

    try {
      const compressedFiles = await Promise.all(
        files.map(async (file) => {
          console.log("압축 전:", (file.size / 1024).toFixed(2), "KB");
          const compressed = await imageCompression(file, compressionOptions);
          console.log("압축 후:", (compressed.size / 1024).toFixed(2), "KB");
          return compressed;
        })
      );
      return compressedFiles;
    } catch (error) {
      console.error("이미지 압축 실패:", error);
      throw error;
    }
  }, []);

  return { compressImages };
};

export default useImageCompressor;