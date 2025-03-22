import React from 'react'

const Comment = ({ user, post }) => {
    return (
        <>
            <li className="boder border-b-2 border-gray-100 pb-2">
                <div className="mb-2 text-sm">
                    <strong>유저</strong>
                </div>
                {/* 수정버튼을 눌렀을 때 display:block */}
                <div className="hidden text-sm flex gap-2 mt-2 mb-2">
                    <input
                        type="text"
                        className="w-full bg-gray-100 border border-gray-200 rounded pl-4"
                    />
                    <div className="flex gap-2">
                        <button className="p-2 break-keep border border-gray-300 text-gray-800 rounded hover:border-gray-500 hover:bg-gray-100">저장</button>
                        <button className="p-2 break-keep text-gray-500 hover:text-gray-900 rounded">취소</button>
                    </div>
                </div>
                {/* 작성자와 유저가 동일할 경우 수정 및 삭제 버튼 */}
                <div>
                    {/* 수정버튼을 눌렀을 때 <p>는 hidden */}
                    <p className="text-sm text-gray-800 mb-2">유저의 댓글</p>
                    {post && user && post.editor === user.name && (
                        <div className="flex float-right text-gray-600 text-sm">
                            <button className="p-1 break-keep hover:text-black">수정</button>
                            <p className="p-1">/</p>
                            <button className="p-1 break-keep hover:text-black">삭제</button>
                        </div>
                    )}
                </div>
            </li>
        </>
    )
}

export default Comment;