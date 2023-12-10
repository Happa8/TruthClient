import { FC } from "react";
import { TPost } from "../hooks/connection";
import PostCore from "./PostCore";

type Props = {
  data: TPost;
};

const Post: FC<Props> = ({ data }) => {
  return (
    <>
      {data.reblog === null ? (
        <PostCore data={data} />
      ) : (
        <PostCore data={data.reblog} />
      )}
    </>
  );
};

export default Post;
