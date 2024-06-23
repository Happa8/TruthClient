import { css } from "../styled-system/css";
import LineWrapper from "./components/LineWrapper";
import HomeLine from "./components/HomeLine";
import NoteLine from "./components/NoteLine";

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
          <LineWrapper>
            <div
              className={css({
                fontSize: "large",
                fontWeight: "bold",
                color: "gray.700",
                p: 4,
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
          </LineWrapper>
          <HomeLine />
          <NoteLine />
        </div>
      </div>
    </>
  );
}

export default App;
