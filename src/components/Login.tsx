import { css, cx } from "@/styled-system/css";
import { useAtom } from "jotai";
import { FC, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { tokenAtom } from "../atoms";
import { getToken, loginWithRedirect } from "../hooks/auth";
import Button from "./Button";

const Login: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [_accessToken, setAccessToken] = useAtom(tokenAtom);

  useEffect(() => {
    console.log(searchParams.get("code"));
    const code = searchParams.get("code");
    if (code) {
      getToken(code).then((res) => {
        if (res.access_token) {
          setSearchParams({});
          setAccessToken(res.access_token);
          localStorage.setItem("access_token", res.access_token);
          console.log(res.access_token);
        }
      });
    }
  }, [searchParams, setSearchParams, setAccessToken]);

  return (
    <div
      className={cx(
        css({
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          bgColor: "gray.100",
        })
      )}
    >
      <div
        className={css({
          w: "100%",
          maxWidth: 400,
          p: 8,
          bgColor: "white",
          borderRadius: 4,
          borderColor: "gray.200",
          borderWidth: 1,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          alignItems: "center",
        })}
      >
        <h1
          className={css({
            fontSize: "3xl",
            fontWeight: "bold",
            color: "gray.800",
          })}
        >
          Truthdeck{" "}
          <span
            className={css({
              fontSize: "large",
              p: 1,
              bgColor: "gray.200",
              baselineShift: "super",
              borderRadius: "4",
            })}
          >
            ALPHA
          </span>
        </h1>
        <p
          className={css({
            color: "gray.600",
          })}
        >
          Truth
          Socialのためのクライアント。現在はALPHA版です。バグだらけなので自己責任で使用してください。文句や要望は&nbsp;
          <a
            className={css({
              color: "blue.500",
              textDecoration: "underline",
            })}
            href="https://truthsocial.com/@happa8"
            target="_blank"
          >
            @happa8
          </a>
          &nbsp;まで
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const loginUrl = loginWithRedirect();
            window.location.href = loginUrl;
          }}
          className={css({
            w: "100%",
          })}
        >
          <Button
            className={css({
              w: "100%",
            })}
            type="submit"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
