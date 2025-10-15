"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";

interface ErrorProps {
  error: Error;
  reset: () => void;
}
function Error({ error, reset }: ErrorProps) {
  const router = useRouter(); // next/navigation

  useEffect(() => {
    console.log(error.message);
  }, []);
  return (
    <div>
      <h3>{error.message} 에러가 발생했습니다.</h3>
      {/* <button onClick={reset}>다시 시도</button> */}
      {/* <button onClick={() => window.location.reload()}>다시 시도</button> */}
      <button
        onClick={() => {
          startTransition(() => {
            router.refresh(); // 서버  컴포넌트 다시 실행
            reset(); // 에러 초기화, 리랜더링
          });
        }}
      >
        다시 시도
      </button>
    </div>
  );
}

export default Error;
