import React from "react";
import Nav from "../Nav";
import { useState, useEffect } from "react";
import Post from "./Post";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  // current user
  const [user, setUser] = useState(null);
  // all posts
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/home", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
          setPosts(data.posts);
        } else {
          console.error("Error fetching data:", data.message);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handlePostDelete = (deletedPostId) => {
    setPosts((posts) => posts.filter((post) => post._id !== deletedPostId));
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
        <Nav page={"home"} />

        <div className="main-cont">
          {user || posts.length > 0 ? (
            posts
              .slice()
              .reverse()
              .map((element, index) => (
                <Post
                page="home"
                  key={index}
                  user={user}
                  postData={element}
                  initialComments={element.comments.length}
                  initialLikes={element.likes.length}
                  isLiked={element.likes.includes(user._id)}
                  onPostDelete={handlePostDelete}
                />
              ))
          ) : (
            <p className="loading">Loading posts...</p>
          )}
        </div>
      </div>
    </>
  );
}
