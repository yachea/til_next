"use client";
import styles from "@/components/DeleteBt.module.css";
import { deleteAction } from "@/actions/deleteActions";
import { GoodDataType } from "@/types/types";
import { useActionState, useEffect, useRef } from "react";

export const DeleteBt = ({ id }: GoodDataType) => {
  const [state, formAction, isPending] = useActionState(deleteAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && !state.status) {
      alert(state.message);
    }
  }, [state]);

  return (
    <>
      <form action={formAction} className={styles.container} ref={formRef}>
        <input type="hidden" name="goodid" value={id} readOnly hidden />
        {isPending ? (
          <div className={styles.delete_btn}>Deleting...</div>
        ) : (
          <div
            className={styles.delete_btn}
            onClick={() => formRef.current?.requestSubmit()}
          >
            Delete
          </div>
        )}
      </form>
    </>
  );
};
