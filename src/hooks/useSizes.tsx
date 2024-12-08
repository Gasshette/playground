import { RefObject, useEffect } from 'react';

export const HANDLE_FIRST_DIV_SIZE_KEY = 'handle_first_div_size';
export const HANDLE_SECOND_DIV_SIZE_KEY = 'handle_second_div_size';

export const resetSizes = () => {
  sessionStorage.removeItem(HANDLE_FIRST_DIV_SIZE_KEY);
  sessionStorage.removeItem(HANDLE_SECOND_DIV_SIZE_KEY);
};

export interface Sizes {
  firstDivSize: DOMRect | null;
  secondDivSize: DOMRect | null;
}

export const useSizes = (
  firstDivRef: RefObject<HTMLDivElement>,
  secondDivRef: RefObject<HTMLDivElement>
) => {
  const getSizes = (): Sizes => {
    const firstDivSize = sessionStorage.getItem(HANDLE_FIRST_DIV_SIZE_KEY);
    const secondDivSize = sessionStorage.getItem(HANDLE_SECOND_DIV_SIZE_KEY);

    return {
      firstDivSize: firstDivSize ? JSON.parse(firstDivSize) : null,
      secondDivSize: secondDivSize ? JSON.parse(secondDivSize) : null
    };
  };

  const saveSizes = () => {
    if (firstDivRef?.current) {
      sessionStorage.setItem(
        HANDLE_FIRST_DIV_SIZE_KEY,
        JSON.stringify(firstDivRef.current.getBoundingClientRect())
      );
    }

    if (secondDivRef?.current) {
      sessionStorage.setItem(
        HANDLE_SECOND_DIV_SIZE_KEY,
        JSON.stringify(secondDivRef.current.getBoundingClientRect())
      );
    }
  };

  useEffect(() => {
    if (firstDivRef?.current) {
      sessionStorage.setItem(
        HANDLE_FIRST_DIV_SIZE_KEY,
        JSON.stringify(firstDivRef.current.getBoundingClientRect())
      );
    }
  }, [firstDivRef]);

  useEffect(() => {
    if (secondDivRef?.current) {
      sessionStorage.setItem(
        HANDLE_SECOND_DIV_SIZE_KEY,
        JSON.stringify(secondDivRef.current.getBoundingClientRect())
      );
    }
  }, [secondDivRef]);

  return { getSizes, saveSizes };
};
