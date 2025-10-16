"use client";
import style from "@/components/ReviewForm.module.css";
import { createReviewAction } from "@/actions/create-review-action";
import { useActionState, useEffect } from "react";

export default function ReviewForm() {
  // 리액트 19버전에서 추가됨 : Server Action 의 매개변수 변화
  // state : 리턴값
  // formAction : 연결한 Server Action
  // isPending : 네트워크에서 진행중인 상태
  const [state, formAction, isPending] = useActionState(
    createReviewAction,
    null
  );

  // state 가 바뀔때 마다 체크함
  useEffect(() => {
    if (state && !state.message) {
      alert(state.message);
    }
  }, [state]);

  // 서버 액션이 진행중 ...
  if (isPending) {
    // return <div>서버 액션 진행중 ...</div>;
  }
  // 서버 액션의 결과가 status 가 false 라면
  if (state?.status === false) {
    return <div>{state.message}</div>;
  }

  return (
    <div className={style.add_container}>
      <h3>리뷰 추가하기 </h3>
      <form action={formAction} className={style.form_container}>
        <input type="hidden" name="id" value={500} readOnly />
        <div className={style.input_container}>
          <input
            disabled={isPending}
            type="text"
            name="title"
            placeholder="상품명"
            required
            defaultValue={"test product"}
          />
          <input
            disabled={isPending}
            type="text"
            name="price"
            placeholder="가격"
            required
            defaultValue={"13.5"}
          />
        </div>
        <textarea
          disabled={isPending}
          name="description"
          placeholder="설명"
          required
          defaultValue={"lorem..."}
        />
        <div className={style.input_container}>
          <input
            disabled={isPending}
            type="text"
            name="image"
            placeholder="이미지"
            required
            defaultValue={"https://i.pravatar.cc"}
          />
          <input
            disabled={isPending}
            type="text"
            name="category"
            placeholder="카테고리"
            required
            defaultValue={"category"}
          />
        </div>
        <button disabled={isPending} type="submit">
          {isPending ? "등록중..." : "작성하기"}
        </button>
      </form>
    </div>
  );
}
