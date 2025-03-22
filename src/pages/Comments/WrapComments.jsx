import React, { useState, useEffect } from "react";
import CommentList from "./CommentList";

export default function WrapComments({ user, post }) {
    return (
        <div className="w-full mt-6 boder border-t-4 border-gray-200">
            <div className="flex gap-2 mt-6 mb-6">
                <input
                type="text"
                placeholder="댓글 달기..."
                className="text-sm w-full p-2 bg-gray-100 border border-slate-400 rounded pl-4"
                />
                <button className="text-sm break-keep w-[80px] bg-blue-600 text-white rounded hover:bg-blue-800">
                게시
                </button>
            </div>

            <CommentList 
                user={user}
                post={post}
            />
        </div>
    );
}
