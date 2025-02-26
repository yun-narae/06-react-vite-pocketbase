import React, { useEffect, useState, useRef } from "react";
import pb from "../lib/pocketbase";
import getPbImageURL from "../lib/getPbImageURL";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

const Post = ({ isLoggedIn, isDarkMode, setDarkMode, isLoading, setIsLoading }) => {
    const user = pb.authStore.model;
    const fileInputRef = useRef(null);
    const [postData, setPostData] = useState([]);
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [postImgs, setPostImgs] = useState([]);
    const [previewImgs, setPreviewImgs] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [editPost, setEditPost] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);
    const [isCreating, setIsCreating] = useState(false);
    const [creatModal, setCreatModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");


    useEffect(() => {
        fetchPosts();
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 500);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // 게시물 목록을 가져오는 함수
    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const posts = await pb.collection("post").getFullList({ autoCancel: false });
            setPostData(posts);
            setFilteredPosts(posts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewPost = () => {
        setEditPost(null);
        setTitle("");
        setText("");
        setPostImgs([]);
        setPreviewImgs([]);
        setIsCreating(true);
        setCreatModal(true);
    };

    const uploadFiles = (e) => {
        const files = Array.from(e.target.files);
        if ((editPost?.field?.length || 0) + postImgs.length + files.length > 3) {
            alert("업로드 이미지 갯수를 초과하였습니다.");
            return;
        }
        const newPreviewImgs = files.map(file => URL.createObjectURL(file));
        setPostImgs(prev => [...prev, ...files].slice(0, 3 - (editPost?.field?.length || 0)));
        setPreviewImgs(prev => [...prev, ...newPreviewImgs].slice(0, 3 - (editPost?.field?.length || 0)));
    };

    // 새 게시물 업로드 함수
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !text || !user) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("text", text);
            formData.append("editor", user.name);
            formData.append("user", user.id);
            postImgs.forEach((img) => formData.append("field", img));
            await pb.collection("post").create(formData);
            fetchPosts();
            setCreatModal(false);
        } catch (error) {
            console.error("게시물 업로드 실패:", error);
        } finally {
            setUploading(false);
        }
    };

    // 게시물 삭제 함수 (유저와 작성자가 일치하는 경우에만 가능)
    const handleDelete = async (post) => {
        if (post.editor !== user.name) {
            alert("삭제할 권한이 없습니다.");
            return;
        }
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            await pb.collection("post").delete(post.id);
            fetchPosts();
        } catch (error) {
            console.error("게시물 삭제 실패:", error);
        }
    };

    const handleEdit = (post) => {
        setEditPost(post);
        setTitle(post.title);
        setText(post.text);
        setPreviewImgs([]);
        setPostImgs([]);
        setEditModal(true);
    };

    const removeExistingImage = (index) => {
        if (editPost.field.length <= 1) {
            alert("최소 1개의 이미지는 있어야 합니다.");
            return;
        }
        const updatedImages = editPost.field.filter((_, i) => i !== index);
        setEditPost({ ...editPost, field: updatedImages });
    };

    const removePreviewImage = (index) => {
        setPreviewImgs(prev => prev.filter((_, i) => i !== index));
        setPostImgs(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpdate = async () => {
        if (!editPost) return;
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("text", text);
            editPost.field.forEach((img) => formData.append("field", img));
            postImgs.forEach((img) => formData.append("field", img));
            await pb.collection("post").update(editPost.id, formData);
            fetchPosts();
            setEditModal(false);
        } catch (error) {
            console.error("게시물 수정 실패:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleImageClick = (imgSrc) => {
        setSelectedImage(imgSrc);
    };

    const closeImagePreview = () => {
        setSelectedImage(null);
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = postData.filter(post => 
            post.title.toLowerCase().includes(query) || 
            post.text.toLowerCase().includes(query)
        );
        setFilteredPosts(filtered);
    };

    return (
        <>
            <section className="flex justify-center content-center flex-wrap flex-col">
                <div className="flex justify-between">
                    <h1 className="text-2xl pb-4 dark:text-white">Post 기능구현</h1>
                    <button onClick={handleNewPost} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">작성하기</button>
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="검색어를 입력하세요"
                    className="p-2 border rounded mt-4"
                />
                {/* 게시물 작성 폼 */}
                {creatModal && (
                    <div className="z-10 p-4 fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-4 rounded shadow-lg">
                            <h2>{isCreating ? "게시물 작성" : "게시물 수정"}</h2>
                            <form onSubmit={handleSubmit} className="mb-4">
                                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요" className="w-full p-2 border rounded" />
                                <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="내용을 입력하세요" className="w-full p-2 border rounded mt-2" />
                                <input type="file" ref={fileInputRef} onChange={uploadFiles} className="mt-2" multiple accept="image/*" />
                                <div className="mt-2 flex space-x-2">
                                    {previewImgs.map((img, index) => (
                                        <div key={index} className="relative">
                                            <img src={img} alt="미리보기" className="w-20 h-20 object-cover rounded cursor-pointer hover:shadow-xl hover:opacity-80"
                                            onClick={() => handleImageClick(img)}/>
                                            <button onClick={(e) => {e.preventDefault(); removePreviewImage(index)}} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full">X</button>
                                        </div>
                                    ))}
                                </div>
                                <button type="submit" className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400" disabled={uploading}>{uploading ? "업로드 중..." : "업로드"}</button>
                                <button type="button" onClick={() => setCreatModal(false)} className="ml-2 px-4 py-2 bg-gray-500 text-white rounded">취소</button>
                            </form>
                        </div>
                    </div>
                )}
                {/* 게시물 목록 */}
                <ul className="mt-4 w-full md:w-4/5">
                    {filteredPosts.map((post) => (
                        <li key={post.id} className="border p-4 mb-2 rounded overflow-hidden">
                            <p>{post.editor}님</p>
                            <p>{post.title}</p>
                            <p>{post.text}</p>
                            {post.field && Array.isArray(post.field) ? (
                                <div>
                                    {isMobile ? (
                                        <Swiper navigation modules={[Navigation]} className="">
                                            {post.field.map((img, index) => (
                                                <SwiperSlide key={index}>
                                                    <img src={`${import.meta.env.VITE_PB_API}/files/${post.collectionId}/${post.id}/${img}`} alt={post.title} className="aspect-square object-cover rounded cursor-pointer hover:shadow-xl hover:opacity-80"
                                                    onClick={() => handleImageClick(`${import.meta.env.VITE_PB_API}/files/${post.collectionId}/${post.id}/${img}`)}
                                                />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    ) : (
                                        <div className="flex space-x-2 bg-blue-400">
                                            {post.field.map((img, index) => (
                                                <img key={index} src={`${import.meta.env.VITE_PB_API}/files/${post.collectionId}/${post.id}/${img}`} alt={post.title} className="w-[32.5%] md:w-[32.8%] aspect-square object-cover rounded cursor-pointer hover:shadow-xl hover:opacity-80" onClick={() => handleImageClick(`${import.meta.env.VITE_PB_API}/files/${post.collectionId}/${post.id}/${img}`)}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : null}
                            {post.editor === user.name && (
                                <>
                                    <button onClick={() => handleEdit(post)} className="mt-2 px-2 py-1 bg-yellow-500 text-white rounded">수정</button>
                                    <button onClick={() => handleDelete(post)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded">삭제</button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
                {/* 게시물 수정 */}
                {editModal && (
                    <div className="z-10 p-4 fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-4 rounded shadow-lg">
                            <h2>게시물 수정</h2>
                            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" />
                            <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full p-2 border rounded mt-2" />
                            <div className="mt-2 flex space-x-2">
                                {editPost?.field?.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={`${import.meta.env.VITE_PB_API}/files/${editPost.collectionId}/${editPost.id}/${img}`} alt="기존 이미지"
                                            className="w-20 h-20 object-cover rounded cursor-pointer hover:shadow-xl hover:opacity-80"
                                            onClick={() => handleImageClick(`${import.meta.env.VITE_PB_API}/files/${editPost.collectionId}/${editPost.id}/${img}`)}
                                        />
                                        <button onClick={() => removeExistingImage(index)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full">X</button>
                                    </div>
                                ))}
                                {previewImgs.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img src={img} alt="미리보기" className="w-20 h-20 object-cover rounded cursor-pointer hover:shadow-xl hover:opacity-80" onClick={() => handleImageClick(img)}/>
                                        <button onClick={() => removePreviewImage(index)} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full">X</button>
                                    </div>
                                ))}
                            </div>
                            <input type="file" onChange={uploadFiles} className="mt-2" multiple accept="image/*" />
                            <button onClick={handleUpdate} className="mt-4 px-4 py-2 bg-green-500 text-white rounded">수정 완료</button>
                            <button onClick={() => setEditModal(false)} className="ml-2 px-4 py-2 bg-gray-500 text-white rounded">취소</button>
                        </div>
                    </div>
                )}
                {/* 이미지 확대 모달 */}
                {selectedImage && (
                    <div className="p-6 fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-10" onClick={closeImagePreview}>
                        <div className="relative">
                        <img
                            src={selectedImage}
                            alt="확대된 이미지"
                            className="max-w-full max-h-screen rounded"
                            onClick={(e) => e.stopPropagation()} // 이미지 클릭 시 닫히지 않도록 설정
                        />
                            <button
                                className="absolute top-4 right-4 bg-white p-2 rounded-full hover:bg-slate-300"
                                onClick={(e) => {
                                    e.stopPropagation(); // X 버튼 클릭 시 닫힘, 부모 이벤트 전파 방지
                                    closeImagePreview();
                                }}
                            >
                                X
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
};

export default Post;
