// import { useEffect, useRef, useState } from "react";
import { css } from "../styled-system/css";
import Post from "./components/Post";
import { useTimeline } from "./hooks/connection";

const accesstoken = import.meta.env.VITE_ACCESS_TOKEN;

function App() {
  const { posts, loadMoreTimeLine, isFetching, notifications } =
    useTimeline(accesstoken);

  return (
    <>
      <div
        className={css({
          fontSize: "sm",
          fontFamily: "notosans",
          display: "flex",
        })}
      >
        <div
          className={css({
            display: "flex",
            flexDir: "column",
            w: 300,
          })}
        >
          {posts.map((post) => {
            return <Post key={post.id} data={post} />;
          })}
          {isFetching ? (
            <p>Loading...</p>
          ) : (
            <button
              onClick={() => {
                loadMoreTimeLine();
              }}
            >
              Load
            </button>
          )}
        </div>
        <div
          className={css({
            display: "flex",
            flexDir: "column",
            w: 400,
          })}
        >
          {notifications.map((note) => {
            return (
              <p>
                {note.account.displayName} {note.type}
              </p>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
