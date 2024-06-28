import { css, cx } from "@/styled-system/css";
import { FC } from "react";
import TextArea from "./TextArea";
import { atom, useAtom, useAtomValue } from "jotai";
import { usePostTruth } from "../hooks/post";
import { QuotePostAtom, useNullableAtomValue } from "../atoms";
import InnerPost from "./InnerPost";
import { MdCancel } from "react-icons/md";

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
  const quotePost = useNullableAtomValue(quotePostAtom);

  const { mutateAsync, status } = usePostTruth();

  const onSubmit = () => {
    mutateAsync({
      content: truthText,
      quoteId: quotePost?.id,
    }).then(() => {
      setTruthText("");
      setQuotePostAtom(null);
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
        placeholder="What's the Truth?"
      />

      {quotePostAtom && (
        <div
          className={css({
            position: "relative",
          })}
        >
          <InnerPost postdataAtom={quotePostAtom} />
          <button
            type="button"
            className={css({
              position: "absolute",
              top: 0,
              right: 0,
              padding: 2,
              cursor: "pointer",
              color: "gray.400",
            })}
            onClick={() => {
              setQuotePostAtom(null);
            }}
          >
            <MdCancel />
          </button>
        </div>
      )}

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
