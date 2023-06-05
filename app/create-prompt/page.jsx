"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Form from "@components/Form";

const CreatePrompt = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    prompt: "",
    tag: "",
    likes: 0,
    dislikes: 0,
  });
  const createPrompt = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/prompt/new", {
        method: "POST",
        body: JSON.stringify({
          prompt: post.prompt,
          userId: session?.user.id,
          tag: post.tag,
          likes: post.likes,
          dislikes: post.dislikes,
        }),
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      //finally happens even if there is error or not
      setSubmitting(false);
    }
  };

  return (
    <Form
      type="Create"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={createPrompt}
    />
  );
};

export default CreatePrompt;
