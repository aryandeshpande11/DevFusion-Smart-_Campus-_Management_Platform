import { useEffect, useState } from "react";

// runs an api call on mount and exposes { data, isLoading, error, reload } —
// keeps every dashboard page from repeating the same three useState calls
export function useFetch(fetchFn, dependencies = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);
    setError(null);

    fetchFn()
      .then((result) => {
        if (!isCancelled) setData(result);
      })
      .catch((fetchError) => {
        if (!isCancelled) setError(fetchError);
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false);
      });

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, reloadCount]);

  const reload = () => setReloadCount((count) => count + 1);

  return { data, isLoading, error, reload };
}
