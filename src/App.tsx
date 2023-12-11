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
          w: "100svw",
          h: "100svh",
          bgColor: "gray.300",
        })}
      >
        <div
          className={css({
            fontSize: "sm",
            fontFamily: "notosans",
            display: "flex",
            w: "100%",
            h: "100%",
            gap: 1,
          })}
        >
          <div
            className={css({
              display: "flex",
              flexDir: "column",
              w: 300,
              h: "100%",
              overflowY: "auto",
              bgColor: "gray.100",
              p: 4,
            })}
          >
            <div
              className={css({
                fontSize: "large",
                fontWeight: "bold",
                color: "gray.700",
              })}
            >
              TRUTH Deck
            </div>
            <div
              className={css({
                w: "100%",
                h: "2px",
                my: 4,
                bgColor: "gray.200",
              })}
            />
          </div>
          <div
            className={css({
              display: "flex",
              flexDir: "column",
              w: 300,
              h: "100%",
              overflowY: "scroll",
              position: "relative",
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
            d
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
      </div>
    </>
  );
}

export default App;
