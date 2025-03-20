import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const PostContent = ({ onClick, user, post, handleImageClick, isMobile, handleDelete, handleEdit }) => {

    return (
        <div>
            <div className="mb-2">
                <p className="font-bold text-gray-700 mb-2">{post.editor}님</p>
                <h2 className="text-xl font-bold">{post.title}</h2>
                <p className="text-gray-700 mb-2">{post.text}</p>
                <p className="text-sm text-gray-500">
                    {new Date(post.updated).toISOString().split("T")[0]}
                </p>
            </div>
            
            {/* 이미지 슬라이더 */}
            {post.field && Array.isArray(post.field) ? (
                <div onClick={onClick}  // ✅ 부모 이벤트 방지 적용
                > 
                    {isMobile ? (
                        <Swiper navigation modules={[Navigation]} className="">
                            {post.field.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <img 
                                        src={`${import.meta.env.VITE_PB_API}/files/${post.collectionId}/${post.id}/${img}`} 
                                        alt={post.title} 
                                        className="aspect-square object-cover rounded cursor-pointer hover:shadow-xl hover:opacity-80"
                                        onClick={() => handleImageClick(img, post, true)} // ✅ 기존 이미지 클릭 시 PostImageModal 실행
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="flex space-x-2 bg-blue-400">
                            {post.field.map((img, index) => (
                                <img 
                                    key={index} 
                                    src={`${import.meta.env.VITE_PB_API}/files/${post.collectionId}/${post.id}/${img}`} 
                                    alt={post.title} 
                                    className="w-[32.5%] md:w-[32.8%] aspect-square object-cover rounded cursor-pointer hover:shadow-xl hover:opacity-80" 
                                    onClick={() => handleImageClick(img, post, true)} // ✅ 기존 이미지 클릭 시 PostImageModal 실행
                                />
                            ))}
                        </div>
                    )}
                </div>
            ) : null}

            {post && user && post.editor === user.name && (
                <div onClick={onClick}  // ✅ 부모 이벤트 방지 적용
                >
                    <button 
                        onClick={() => handleEdit(post)} 
                        className="mt-2 px-2 py-1 bg-yellow-500 text-white rounded">
                        수정
                    </button>
                    <button 
                        onClick={() => handleDelete(post)} 
                        className="ml-2 px-2 py-1 bg-red-500 text-white rounded">
                        삭제
                    </button>
                </div>
            )}
        </div>
    );
};

export default PostContent;
