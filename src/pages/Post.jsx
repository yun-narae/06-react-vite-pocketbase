import React, { useState, useEffect } from "react";
import pb from "../lib/pocketbase";
import PostList from "./PostList";
import PostModal from "./PostModal";
import { useUser } from "../context/UserContext"; // ✅ Context에서 `user` 가져오기

const Post = () => {
    const user = useUser(); // ✅ 부모(`UserProvider`)에서 `user` 받아오기
    const [postData, setPostData] = useState([]);
    const [editPost, setEditPost] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);
    const [isLoading, setIsLoading] = useState(false); // 🔹 전체적인 로딩 상태
    const [isDataLoaded, setIsDataLoaded] = useState(false); // 🔹 postData가 완전히 로드되었는지 여부
    
    useEffect(() => {
        fetchPosts();
    }, []);
    
    useEffect(() => {
        console.log("Post 컴포넌트가 리렌더링됨");
    });
    

    const fetchPosts = async () => {
        setIsLoading(true); // 🔹 데이터 요청 시작
        setIsDataLoaded(false); // 🔹 데이터 로드 상태 초기화
        try {
            const posts = await pb.collection("post").getFullList({ autoCancel: false });
            posts.forEach(post => {
                post.updated = post.updated.split("T")[0];
            });
            setPostData(posts.sort((a, b) => new Date(b.updated) - new Date(a.updated)));
            setIsDataLoaded(true); // 🔹 데이터 로드 완료
        } catch (error) {
            console.error("게시물 가져오기 실패:", error);
        } finally {
            setIsLoading(false); // 🔹 데이터 요청 완료
        }
    };

    return (
        <section className="flex flex-col items-center">
            <div className="flex justify-between w-full max-w-2xl">
                <h1 className="text-2xl pb-4">게시판</h1>
                <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-blue-500 text-white rounded">
                    작성하기
                </button>
            </div>

            <PostList 
                user={user}
                postData={postData}
                editPost={editPost}
                setEditPost={setEditPost}
                editModal={editModal} 
                setEditModal={setEditModal}
                setShowForm={setShowForm} 
                fetchPosts={fetchPosts}
                isMobile={isMobile}
                setIsMobile={setIsMobile}

                isLoading={isLoading} // 🔹 로딩 상태 전달
                isDataLoaded={isDataLoaded} // 🔹 데이터 로드 여부 전달
            />

            {showForm && (
                <PostModal 
                    setShowForm={setShowForm} 
                    fetchPosts={fetchPosts}  // ✅ 이미지 클릭 핸들러 전달
                />
            )}

            {/* ✅ PostImageModal을 selectedImage 상태에 따라 렌더링 */}
            {/* {selectedImage && (
                <PostImageModal 
                    selectedImage={selectedImage} 
                    setSelectedImage={setSelectedImage} 
                />
            )} */}
        </section>
    );
};

export default Post;
