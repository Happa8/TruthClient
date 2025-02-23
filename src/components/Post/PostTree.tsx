import { TPostTree } from "@/src/hooks/reply";
import { FC } from "react";
import Post from "./Post";

type Props = {
  tree: TPostTree[];
  type: "parent" | "children";
};

const PostTree: FC<Props> = ({ tree, type }) => {
  return (
    <>
      {tree.map((post, i) => (
        <>
          <Post
            key={post.data.toString()}
            dataAtom={post.data}
            isTree={type === "parent" || i !== tree.length - 1}
          />
          {/* <PostTree tree={post.children} /> */}
        </>
      ))}
    </>
  );
};

export default PostTree;
