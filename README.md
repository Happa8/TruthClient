# Truthdeck

Truth Social 非公式クライアント  
https://truthdeck.happa8.dev

## これは何

純米国産 SNS「Truth Social」専用のクライアントです。通常の Mastodon クライアントでは対応できない Truth 専用機能などにも対応したクライアントを目指しています。  
現在 Alpha バージョンなので、クライアントとしてできることが非常に少ない状態です。バグも多いため、利用は自己責任でお願いします。

## ローカルで動かす方法

- ルートディレクトリに以下の形式の `.env.loval` ファイルを作成してください。

```
VITE_CLIENT_ID=ここにclient_idを入力
VITE_CLIENT_SECRET=ここにclient_secretを入力
VITE_REDIRECT_URI=https://localhost:5173/
```

なお、`clinet_id`と`client_secret`は API を直接叩くほか、Truth 内（https://truthsocial.com/developers/apps/create ）からも取得可能です。その際、scopes は"read write follow"にし、redirect URIs は上記で指定したのと同じものにしてください。

- パッケージをインストールし、起動

```bash
$ pnpm i
$ pnpm dev
```
