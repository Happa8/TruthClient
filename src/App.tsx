import { useAtom, useAtomValue } from "jotai";
import { css } from "../styled-system/css";
import HomeLine from "./components/Line/HomeLine";
import NoteLine from "./components/Line/NoteLine";
import SendLine from "./components/Line/SendLine";
import TagTimeLine from "./components/Line/TagTimeLine";
import { ColumnsAtom, tokenAtom } from "./atoms";
import PostDetailLine from "./components/Line/PostDetailLine";
import Login from "./components/Page/Login";
import { UserLine } from "./components/Line/UserLine";

function App() {
  const ColumnsData = useAtomValue(ColumnsAtom);
  const [accessToken, setAccessToken] = useAtom(tokenAtom);

  const localAccessToken = localStorage.getItem("access_token");

  if (
    localAccessToken !== null &&
    localAccessToken !== undefined &&
    accessToken === ""
  ) {
    setAccessToken(localAccessToken);
  }

  if (accessToken === "") {
    return <Login />;
  }

  return (
    <>
      <div
        className={css({
          w: "100svw",
          h: "100svh",
          bgColor: "gray.300",
          overflowX: "auto",
        })}
      >
        <div
          className={css({
            fontSize: "sm",
            fontFamily: "notosans",
            display: "flex",
            flexFlow: "row",
            flexWrap: "nowrap",
            w: "fit",
            h: "100%",
            gap: 1,
          })}
        >
          <SendLine />
          {ColumnsData.map((column, i) => {
            switch (column.type) {
              case "Home":
                return <HomeLine key={i} />;
              case "Notification":
                return <NoteLine key={i} />;
              case "PostDetail":
                return (
                  <PostDetailLine
                    key={i}
                    postId={column.postId}
                    columnIndex={i}
                  />
                );

              case "UserDetail":
                return (
                  <UserLine key={i} userId={column.userId} columnIndex={i} />
                );
              case "Tag":
                return <TagTimeLine key={i} tag={column.tag} />;
              default:
                return <></>;
            }
          })}
        </div>
      </div>
    </>
  );
}

export default App;
