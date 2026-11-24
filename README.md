# UMCine

## 로컬 실행

기존 TMDB와 백엔드 설정을 프로젝트의 `.env.local`에 입력한다.

```dotenv
NEXT_PUBLIC_TMDB_API_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_ACCESS_TOKEN=
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/
```

```sh
pnpm install
pnpm dev
```

[localhost:5173](http://localhost:5173)에서 접속한다. 로그인과 내 정보 등 회원 기능을 사용하려면 백엔드도 실행한다.

`pnpm build`로 프로덕션 빌드, `pnpm start`로 빌드 결과를 실행한다.
