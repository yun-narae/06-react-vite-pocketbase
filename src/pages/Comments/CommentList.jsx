import React from "react";
import Comment from './Comment';

const CommentList = ({ user, post, comments, setComments, onCommentCountChange }) => {
    return (
        <ul className="flex flex-col gap-4">
            {comments.map(comment => (
                <Comment
                    key={comment.id}
                    comment={comment}
                    user={user}
                    post={post}
                    setComments={setComments}
                    onCommentCountChange={onCommentCountChange}
                />
            ))}
        </ul>
    );
};

export default CommentList;
