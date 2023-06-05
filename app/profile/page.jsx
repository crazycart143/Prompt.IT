"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [myPosts, setMyPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();

      setMyPosts(data);
    };

    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this prompt?"
    );

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: "DELETE",
        });

        const filteredPosts = myPosts.filter((item) => item._id !== post._id);

        setMyPosts(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleLike = async (post) => {
    try {
      const response = await fetch(`/api/prompt/${post._id}`, {
        method: "PATCH",
        body: JSON.stringify({ action: "like" }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        const updatedPost = data.data;
        const updatedPosts = myPosts.map((item) =>
          item._id === updatedPost._id ? updatedPost : item
        );

        setMyPosts(updatedPosts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDislike = async (post) => {
    console.log("running");
    try {
      const response = await fetch(`/api/prompt/${post._id}`, {
        method: "POST",
        body: JSON.stringify({ action: "dislike" }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        const updatedPost = data.data;
        const updatedPosts = myPosts.map((item) =>
          item._id === updatedPost._id ? updatedPost : item
        );

        setMyPosts(updatedPosts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination"
      data={myPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleLike={handleLike}
      handleDislike={handleDislike}
    />
  );
};

export default MyProfile;
