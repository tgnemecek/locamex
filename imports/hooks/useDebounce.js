import React from "react";

const useDebounce = (term, amount = 500) => {
  const [debouncedTerm, setDebouncedTerm] = React.useState(term);
  const timeout = React.useRef(null);
  const isMounted = React.useRef(true);

  React.useEffect(() => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      if (isMounted.current) setDebouncedTerm(term);
    }, amount);
  }, [term]);

  React.useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
      isMounted.current = false;
    };
  }, []);

  return debouncedTerm;
};

export default useDebounce;
