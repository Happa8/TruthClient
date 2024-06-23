import { css } from "../styled-system/css";
import HomeLine from "./components/HomeLine";
import NoteLine from "./components/NoteLine";
import SendLine from "./components/SendLine";

function App() {
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
          <SendLine />
          <HomeLine />
          <NoteLine />
        </div>
      </div>
    </>
  );
}

export default App;
