import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

const PostContent = ({ avatarUrl, commentCount, onClick, user, post, handleImageClick, isMobile, handleDelete, handleEdit }) => {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("🧩 post:", post);
        console.log("🧩 post.expand.user:", post.expand?.user);
        console.log("🧩 post.expand.user.id:", post.expand?.user?.id);
        console.log("🧩 post.expand.user.name:", post.expand?.user?.name);
    }, [post]);

    return (
        <div>
            <Link to={`/mypage/${post.expand?.user?.id}`} 
                className="mb-2 pb-2 text-gray-500 flex font-bold border-b-2 items-center">
                <img src={avatarUrl} alt="프로필" className="w-8 h-8 rounded-full mr-1" />
                <b>{post.expand?.user?.name}님</b>
            </Link>

            <div onClick={() => navigate(`/post/${post.id}`)}>
                <div className="mb-2">
                    <h2 className="text-xl font-bold">{post.title}</h2>
                    <p className="text-gray-700 mb-2">{post.description}</p>
                    <p className="text-sm text-gray-500">
                        {new Date(post.updated).toISOString().split("T")[0]}
                    </p>
                </div>
                {/* 이미지 슬라이더 */}
                {post.images && Array.isArray(post.images) ? (
                    <div>
                        {isMobile ? (
                            <Swiper navigation modules={[Navigation]}>
                                {post.images.map((img, index) => (
                                    <SwiperSlide key={index}>
                                        <img
                                            src={`${import.meta.env.VITE_PB_API}/files/${post.collectionId}/${post.id}/${img}`}
                                            alt={post.title}
                                            className="aspect-square object-cover rounded cursor-pointer hover:shadow-xl hover:opacity-80"
                                            onClick={() => handleImageClick(img, post, true)}
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <div className="flex space-x-2">
                                {post.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={`${import.meta.env.VITE_PB_API}/files/${post.collectionId}/${post.id}/${img}`}
                                        alt={post.title}
                                        className="w-[32.5%] md:w-[32.8%] aspect-square object-cover rounded cursor-pointer hover:shadow-xl hover:opacity-80"
                                        onClick={() => handleImageClick(img, post, true)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : null}
            </div>

            <div className="flex justify-between items-center">
                <div>
                    <p className="font-bold text-xs text-gray-500 mt-2">
                        댓글 ({commentCount}개)
                    </p>
                </div>
                {post && user && post.editor === user.name && (
                    <div>
                        <button
                            onClick={() => handleEdit(post)}
                            className="mt-2 px-2 py-1 bg-yellow-500 text-white rounded"
                        >
                            수정
                        </button>
                        <button
                            onClick={() => handleDelete(post)}
                            className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                        >
                            삭제
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostContent;
