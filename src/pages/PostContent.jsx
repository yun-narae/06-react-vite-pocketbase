import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import ReserveModal from "./ReserveModal";

const PostContent = ({ avatarUrl, commentCount, user, post, handleImageClick, isMobile, handleDelete, handleEdit, fetchPosts }) => {
    const navigate = useNavigate();
    const [showReserveModal, setShowReserveModal] = useState(false);

    useEffect(() => {
        console.log("🧩 post:", post);
        console.log("🧩 post.expand.user:", post.expand?.user);
        console.log("🧩 post.expand.user.id:", post.expand?.user?.id);
        console.log("🧩 post.expand.user.name:", post.expand?.user?.name);
    }, [post]);

    // 예약 정보 파싱
    const reservedUsers = (() => {
        try {
        return post.reservations ? JSON.parse(post.reservations) : [];
        } catch {
        return [];
        }
    })();

    const reservedCount = reservedUsers.reduce((sum, r) => sum + r.count, 0);
    const isClosed = new Date(post.date) < new Date() || reservedCount >= Number(post.capacity);

    return (
        <div>
            <div className="border-b-2 flex items-center justify-between pb-2">
                <Link to={`/mypage/${post.expand?.user?.id}`}
                    className="text-gray-500 flex font-bold items-center">
                    <img src={avatarUrl} alt="프로필" className="w-8 h-8 rounded-full mr-1" />
                    <b>{post.expand?.user?.name}님</b>
                </Link>
                {isClosed ? (
                    <p className="text-xs px-2 py-1 text-white bg-gray-500 rounded-md">모집 마감</p>
                    ) : (
                    <p className="text-xs px-2 py-1 text-white bg-blue-500 rounded-md">모집중</p>
                )}
            </div>

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

            <div className="flex justify-between items-center mb-3">
                <div>
                    <p className="font-bold text-xs text-gray-500 mt-2">
                        댓글 ({commentCount}개)
                    </p>
                </div>
                {post && user && post.editor === user.name && (
                    <div>
                        <button
                            onClick={() => handleEdit(post)}
                            className="text-xs px-2 py-1 mt-2 bg-yellow-500 text-white rounded"
                        >
                            수정
                        </button>
                        <button
                            onClick={() => handleDelete(post)}
                            className="text-xs px-2 py-1 ml-2 bg-red-500 text-white rounded"
                        >
                            삭제
                        </button>
                    </div>
                )}
            </div>

            {/* 예약관련 */}
            <div className="flex items-center justify-end">
                <p className="text-xs mr-2">{reservedCount} / {post.capacity}</p>
                {/* 다른 유저가 쓴 게시물 일경우 예약하기 버튼 활성화 해야함 */}
                {!isClosed && user?.id !== post.expand?.user?.id && (
                    <button onClick={() => setShowReserveModal(true)} className="bg-blue-500 text-white px-2 py-1 rounded">
                    예약하기
                    </button>
                )}

                {showReserveModal && (
                    <ReserveModal
                        post={post}
                        fetchPosts={fetchPosts}
                        onClose={() => setShowReserveModal(false)}
                    />
                )}
            </div>

            {/* PostDetail페이지에서 열었을 경우 보여야 함 */}
            {/* 예약한 유저 목록 */}
            {reservedUsers.length > 0 && (
                <div className="mt-4">
                <b className="block mb-2">현재 예약한 인원들</b>
                <ul className="flex flex-wrap gap-2">
                    {reservedUsers.map((r, i) => (
                    <li key={i} className="text-gray-500 flex items-center text-xs">
                        <span className="font-bold">{r.name}</span>
                    </li>
                    ))}
                </ul>
                </div>
            )}
        </div>
    );
};

export default PostContent;
