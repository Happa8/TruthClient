import { FC } from "react";
import HomeLine from "@/src/components/Line/HomeLine";
import NoteLine from "@/src/components/Line/NoteLine";

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
