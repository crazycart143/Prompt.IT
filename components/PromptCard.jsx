"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const PromptCard = ({ post, handleEdit, handleDelete, handleTagClick }) => {
  const { data: session } = useSession();
  const pathName = usePathname();
  const router = useRouter();

  const [copied, setCopied] = useState("");
  const [like, setLike] = useState(post.likes ? post.likes.length : post.likes);
  const [dislike, setDislike] = useState(
    post.dislikes ? post.dislikes.length : post.dislikes
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileClick = () => {
    if (post.creator._id === session?.user.id) return router.push("/profile");

    router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
  };

  const handleCopy = () => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/prompt/${post._id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user.id,
          postId: post._id,
          removeLike: post.likes.includes(session?.user.id), // Check if the user already liked the post
        }),
      });
      if (response.ok) {
        location.reload();
        console.log("HAHAHAHA");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await fetch(`/api/prompt/${post._id}/dislike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user.id,
          postId: post._id,
          removeLike: post.likes.includes(session?.user.id), // Check if the user already liked the post
        }),
      });
      if (response.ok) {
        const { dislikes } = await response.json();
        setDislike(dislikes.length);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="prompt_card">
      <div className="flex items-start justify-between gap-5">
        <div
          className="flex items-center justify-start flex-1 gap-3 cursor-pointer"
          onClick={handleProfileClick}
        >
          <Image
            src={post.creator.image}
            alt="user_image"
            width={40}
            height={40}
            className="object-contain rounded-full"
          />

          <div className="flex flex-col">
            <h3 className="font-semibold text-gray-900 font-satoshi">
              {post.creator.username}
            </h3>
            <p className="text-sm text-gray-500 font-inter">
              {post.creator.email}
            </p>
          </div>
        </div>

        <div className="copy_btn" onClick={handleCopy}>
          <Image
            src={
              copied === post.prompt
                ? "/assets/icons/tick.svg"
                : "/assets/icons/copy.svg"
            }
            alt={copied === post.prompt ? "tick_icon" : "copy_icon"}
            width={12}
            height={12}
          />
        </div>
      </div>
      <p className="my-4 text-sm text-gray-700 font-satoshi">{post.prompt}</p>
      <p
        className="text-sm cursor-pointer font-inter blue_gradient"
        onClick={() => handleTagClick && handleTagClick(post.tag)}
      >
        {post.tag}
      </p>
      {/* Like and Dislike buttons */}
      <div className="gap-4 pt-3 mt-5 border-t border-gray-100 flex-center">
        <button
          className={`text-sm  font-inter flex ${
            !session
              ? "opacity-50 cursor-not-allowed "
              : "opacity-100 cursor-pointer"
          }`}
          onClick={() => {
            handleLike();
            setIsLoading(true);
          }}
          disabled={!session || isLoading}
        >
          <Image
            src="/assets/icons/like-button.svg"
            height={20}
            width={20}
            alt="like-button"
            className="mr-3"
          />
          <span>{like}</span>
        </button>
        <button
          className={`text-sm cursor-pointer font-inter flex ${
            !session
              ? "opacity-50 cursor-not-allowed"
              : "opacity-100 cursor-pointer"
          }`}
          onClick={handleDislike}
          disabled={!session}
        >
          <Image
            src="/assets/icons/dislike-button.svg"
            height={20}
            width={20}
            alt="like-button"
            className="mr-3 transform rotate-180"
          />
          <span>{dislike}</span>
        </button>
      </div>
      {/* if the user logged in is the creator of the post and he is at the
      profile page then */}
      {session?.user.id === post.creator._id && pathName === "/profile" && (
        <div className="gap-4 pt-3 mt-5 border-t border-gray-100 flex-center">
          <p
            className="text-sm cursor-pointer font-inter green_gradient"
            onClick={handleEdit}
          >
            Edit
          </p>
          <p
            className="text-sm cursor-pointer font-inter orange_gradient"
            onClick={handleDelete}
          >
            Delete
          </p>
        </div>
      )}
    </div>
  );
};

export default PromptCard;
