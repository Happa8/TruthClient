export const loginWithRedirect = () => {
  const params = {
    client_id: import.meta.env.VITE_CLIENT_ID,
    response_type: "code",
    redirect_uri: import.meta.env.VITE_REDIRECT_URI,
    scope: "read write follow",
  };
  return `https://truthsocial.com/oauth/authorize?${new URLSearchParams(
    params
  )}`;
};

export const getToken = async (code: string) => {
  const data = new FormData();
  data.append("grant_type", "authorization_code");
  data.append("client_id", import.meta.env.VITE_CLIENT_ID);
  data.append("client_secret", import.meta.env.VITE_CLIENT_SECRET);
  data.append("code", code);
  data.append("redirect_uri", import.meta.env.VITE_REDIRECT_URI);
  return fetch("https://truthsocial.com/oauth/token", {
    method: "POST",
    body: data,
  }).then(async (res) => {
    const result: {
      access_token: string;
      token_type: string;
      scope: string;
      created_at: number;
    } = await res.json();
    return result;
  });
};
