import { useAtom, useAtomValue } from "jotai";
import { css } from "../styled-system/css";
import HomeLine from "./components/HomeLine";
import NoteLine from "./components/NoteLine";
import SendLine from "./components/SendLine";
import { ColumnsAtom, tokenAtom } from "./atoms";
import PostDetailLine from "./components/PostDetailLine";
import Login from "./components/Login";

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
