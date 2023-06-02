import Link from "next/link";

const Form = ({ type, post, setPost, submitting, handleSubmit }) => {
  return (
    <section className="flex-col w-full max-w-full flex-start">
      <h1 className="head_text text-left"> <span className="blue_gradient"> {type} Post </span> </h1>
    </section>
  );
};

export default Form;
