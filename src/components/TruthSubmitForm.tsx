import { css, cx } from "@/styled-system/css";
import { FC } from "react";
import TextArea from "./TextArea";
import { atom, useAtom, useAtomValue } from "jotai";
import { usePostTruth } from "../hooks/post";
import { QuotePostAtom } from "../atoms";

type Props = {
  className?: string;
};

const truthTextAtom = atom<string>("");
const truthTextCountAtom = atom<number>(
  (get) => [...get(truthTextAtom)].length
);

const TruthSubmitForm: FC<Props> = ({ className }) => {
  const [truthText, setTruthText] = useAtom(truthTextAtom);
  const truthTextCount = useAtomValue(truthTextCountAtom);

  const [quotePostAtom, setQuotePostAtom] = useAtom(QuotePostAtom);

  const { mutateAsync, status } = usePostTruth();

  const onSubmit = () => {
    mutateAsync({
      content: truthText,
    }).then(() => {
      setTruthText("");
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      onSubmit();
    }
  };

  return (
    <form
      className={cx(
        css({
          bgColor: "white",
          padding: 2,
          display: "flex",
          flexDir: "column",
          gap: 2,
        }),
        className
      )}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <TextArea
        value={truthText}
        onChange={(e) => setTruthText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div>
        <span
          className={css({
            fontSize: "xs",
          })}
        >
          {truthTextCount} / 1000
        </span>
      </div>

      <button
        type="submit"
        className={css({
          w: "100%",
          padding: 2,
          bgColor: "gray.200",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
        })}
        disabled={status === "pending"}
      >
        {status === "pending" ? "Posting truth" : "Post truth"}
      </button>
    </form>
  );
};

export default TruthSubmitForm;
