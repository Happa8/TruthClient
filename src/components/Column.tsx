import { FC } from "react";
import HomeLine from "./HomeLine";
import NoteLine from "./NoteLine";
import { TPost, TPostAtom } from "../hooks/connection";

type Column =
  | {
      type: "Home" | "Notification";
    }
  | {
      type: "PostDetail";
      postId: string;
    };

type Props = Column;

const Column: FC<Props> = ({ type }) => {
  switch (type) {
    case "Home":
      return <HomeLine />;
    case "Notification":
      return <NoteLine />;
    default:
      return null;
  }
};

export default Column;
