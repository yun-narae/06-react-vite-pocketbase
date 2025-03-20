import React, { useState, useEffect } from "react";
import PostItem from "./PostItem";

const PostList = ({ 
    user, 
    postData, 
    editPost, 
    setEditPost, 
    editModal, 
    setEditModal, 
    fetchPosts, 
    isMobile, 
    setIsMobile,
    isLoading,
    isDataLoaded,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterOption, setFilterOption] = useState("all");
    const [filteredPosts, setFilteredPosts] = useState([...postData]);

    // 🔹 컴포넌트가 마운트되거나 postData가 변경될 때 기본 필터 적용
    useEffect(() => {
        if (isDataLoaded) {
            filterPosts(searchQuery, filterOption);
        }
    }, [postData, isDataLoaded]); // ✅ postData 변경 시 필터 적용

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        filterPosts(query, filterOption);
    };

    const handleFilterChange = (e) => {
        const selectedOption = e.target.value;
        setFilterOption(selectedOption);
        filterPosts(searchQuery, selectedOption);
    };

    const filterPosts = (query, filter) => {
        let filtered = [...postData];

        if (filter === "myPosts") {
            filtered = filtered.filter(post => post.editor === user.name);
        } else if (filter === "latest") {
            filtered = filtered.sort((a, b) => new Date(b.created) - new Date(a.created));
        }

        if (query) {
            filtered = filtered.filter(post => 
                post.title.toLowerCase().includes(query) || 
                post.text.toLowerCase().includes(query)
            );
        }

        setFilteredPosts(filtered);
    };

    return (
        <div className="w-full max-w-2xl">
            <div className="flex gap-4 mt-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="검색어를 입력하세요"
                    className="w-full p-2 border rounded"
                />
                <select onChange={handleFilterChange} value={filterOption} className="px-4 py-2 border rounded">
                    <option value="all">기본 보기</option>
                    <option value="myPosts">내 게시물 보기</option>
                    <option value="latest">최신 글 보기</option>
                </select>
            </div>

            <ul className="mt-4 w-full">
                    {filteredPosts.map((post) => (
                        <PostItem 
                            key={post.id} 
                            user={user}
                            post={post}
                            fetchPosts={fetchPosts} 
                            editPost={editPost}
                            editModal={editModal}
                            setEditPost={setEditPost}
                            setEditModal={setEditModal}
                            isMobile={isMobile}
                            setIsMobile={setIsMobile}
                        />
                    ))}
            </ul>

            {/* 🔹 로딩 중 상태 표시 */}
            {isLoading && (
                <p className="text-center text-gray-500 mt-4">데이터를 불러오는 중...</p>
            )}

            {/* 🔹 데이터가 로드 완료되었지만 게시물이 없는 경우 */}
            {!isLoading && isDataLoaded && filteredPosts.length === 0 && (
                <p className="text-center text-gray-500 mt-4">게시물이 없습니다.</p>
            )}
        </div>
    );
};

export default PostList;

