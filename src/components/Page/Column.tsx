import { FC } from "react";
import HomeLine from "@/src/components/Line/HomeLine";
import NoteLine from "@/src/components/Line/NoteLine";
import TagTimeLine from "@/src/components/Line/TagTimeLine";

type Column =
  | {
      type: "Home" | "Notification";
    }
  | {
      type: "PostDetail";
      postId: string;
    }
  | {
      type: "Tag";
      tag: string;
    }
  | {
      type: "UserDetail";
      userId: string;
    };

type Props = Column;

const Column: FC<Props> = (props) => {
  switch (props.type) {
    case "Home":
      return <HomeLine />;
    case "Notification":
      return <NoteLine />;
    case "Tag":
      return <TagTimeLine tag={props.tag} />;
    case "UserDetail":
      return <TagTimeLine tag={props.userId} />;
    default:
      return null;
  }
};

export default Column;
