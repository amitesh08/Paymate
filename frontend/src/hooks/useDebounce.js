// src/hooks/useDebounce.js
import { useEffect, useState } from "react";

const useDebounce = (value, delay = 500) => {
  const [debouncedVal, setDebouncedVal] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedVal(value), delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedVal;
};

export default useDebounce;
