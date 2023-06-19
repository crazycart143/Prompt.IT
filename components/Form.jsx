import Link from "next/link";

const Form = ({ type, post, setPost, submitting, handleSubmit }) => {
  const handleTagChange = (e) => {
    const tagValue = e.target.value;
    const formattedTag = tagValue.startsWith("#") ? tagValue : `#${tagValue}`;
    setPost({ ...post, tag: formattedTag });
  };

  return (
    <section className="flex-col w-full max-w-full flex-start">
      <h1 className="text-left head_text">
        {" "}
        <span className="blue_gradient"> {type} Post </span>{" "}
      </h1>
      <p className="max-w-md text-left desc">
        {type} and share amazing prompts with the world, and let your
        imagination run wild with any AI-powered platform.
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full max-w-2xl mt-10 glassmorphism"
      >
        <label>
          <span className="text-base font-semibold text-gray-700 font-satoshi">
            Your AI Prompt
          </span>
          <textarea
            value={post.prompt}
            onChange={(e) => setPost({ ...post, prompt: e.target.value })}
            placeholder="Write your Prompt here..."
            required
            className="form_textarea"
          ></textarea>
        </label>
        <label>
          <span className="text-base font-semibold text-gray-700 font-satoshi">
            Tag
            <span className="font-normal">
              {" "}
              (#product, #webdevelopment, #idea)
            </span>
          </span>
          <input
            value={post.tag}
            onChange={handleTagChange}
            placeholder="#tag"
            required
            className="form_input"
          ></input>
        </label>
        <div className="gap-4 mx-3 mt-5 flex-end">
          <Link href="/" className="text-sm text-gray-500">
            {" "}
            Cancel{" "}
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white"
          >
            {submitting ? `${type}...` : type}
          </button>
        </div>
      </form>
    </section>
  );
};

export default Form;
