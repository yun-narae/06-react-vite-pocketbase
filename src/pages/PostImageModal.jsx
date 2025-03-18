import React from "react";

const PostImageModal = ({ selectedImage, setSelectedImage }) => {
    if (!selectedImage) return null; // 선택된 이미지가 없으면 렌더링하지 않음

    return (
        <div 
            className="p-6 fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-20" 
            onClick={(e) => e.stopPropagation()} // 배경 클릭 시 모달 닫기
        >
            <div className="relative" onClick={(e) => e.stopPropagation()}> {/* 내부 클릭 시 닫히지 않도록 설정 */}
                <img 
                    src={selectedImage} 
                    alt="확대된 이미지" 
                    className="max-w-full max-h-screen rounded"
                />
                <button
                    className="absolute top-4 right-4 bg-white p-2 rounded-full hover:bg-slate-300"
                    onClick={(e) => {
                        e.stopPropagation(); // 부모 `div`의 클릭 이벤트 전파 방지
                        setSelectedImage(null); // 모달 닫기
                    }}
                >
                    X
                </button>
            </div>
        </div>
    );
};

export default PostImageModal;
