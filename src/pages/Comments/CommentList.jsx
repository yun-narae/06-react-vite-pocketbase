import React from "react"
import Comment from './Comment';

const CommentList = ({ user, post }) => {
    return (
        <div>
            <ul className="flex flex-col gap-4">
                <Comment 
                    user={user}
                    post={post}
                />
            </ul>
        </div>
    )
}

export default CommentList;