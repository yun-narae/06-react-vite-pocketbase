import { useState } from "react";

const useImageViewer = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (img, post, isExistingImage) => {
        let imgSrc;
        if (isExistingImage && post) {
            imgSrc = `${import.meta.env.VITE_PB_API}/files/${post.collectionId}/${post.id}/${img}`;
        } else {
            imgSrc = img;
        }
        setSelectedImage(imgSrc);
    };

    return { selectedImage, setSelectedImage, handleImageClick };
};

export default useImageViewer;
