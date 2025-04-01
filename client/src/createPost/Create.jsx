import React, { useEffect } from "react";
import Nav from "../Nav";
import Post from "../home/Post";
import { useLocation } from "react-router-dom";
import { useState, useRef } from "react";

export default function Create() {
  const location = useLocation();
  const postBtn = useRef(null);
  const { posts, user } = location.state || {};
  const [post, setPost] = useState("");
  const [postsArray, setPostsArray] = useState(posts);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch("/api/post");
        if (response.ok) {
          const data = await response.json();
          setPostsArray(data.posts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPostData();
  }, []);

  const handleChange = (event) => {
    setPost(event.target.value);
  };
  useEffect(() => {
    if (post === "") {
      postBtn.current.classList.add("disable");
      postBtn.current.setAttribute("disabled", "true");
    } else {
      postBtn.current.classList.remove("disable");
      postBtn.current.removeAttribute("disabled");
    }
  }, [post]);

  async function createPost(event) {
    event.preventDefault();
    if (post === "") return;
    const content = post;
    try {
      const response = await fetch("/api/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("API Response:", data.posts)
        // console.log(data.posts);
        setPostsArray([...data.posts]);
        setPost("");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }

  const handlePostDelete = (deletedPostId) => {
    // Filter out the deleted post from postsArray
    setPostsArray((postsArray) =>
      postsArray.filter((post) => post._id !== deletedPostId)
    );
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Nav />

        <div className="main-cont">
          <div className="create-post">
            <form action="/post" method="POST">
              <h2 className="heading post-heading create-post-heading">
                Create a post
              </h2>
              <textarea
                required
                rows="4"
                className="post-content"
                placeholder="What's on your mind?"
                name="content"
                value={post}
                onChange={handleChange}
              ></textarea>
              <input
                ref={postBtn}
                onClick={createPost}
                className="submit-form post-submit reply"
                id="submit"
                type="submit"
                value="Create Post"
              />
            </form>
          </div>
          <div className="posts">
            {postsArray.length === 0 ? (
              <p className="sub-heading">No posts yet</p>
            ) : (
              <p className="sub-heading">Your posts</p>
            )}

            {[...(postsArray || [])].reverse().map((element, index) => {
              const isLiked = (element.likes || []).includes(user._id);
              return (
                <Post
                  page="create"
                  key={index}
                  user={user}
                  postData={element}
                  initialComments={element.comments?.length || 0}
                  initialLikes={(element.likes || []).length}
                  // initialLikes={element.likes?.length}
                  isLiked={!!isLiked}
                  onPostDelete={handlePostDelete}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
