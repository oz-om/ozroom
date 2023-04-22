import { lazy, Suspense } from "react";
import { wait } from "./components/global";

export const lazyLoad = (path, namedImport) => {
  const Component = lazy(() => {
    let promise = import(path /* @vite-ignore */);
    if (namedImport != null) {
      return promise.then((module) => {
        return { default: module[namedImport] };
      });
    }
    return promise;
  });
  return (props) => (
    <Suspense fallback={<div className='h-screen'>Loading...</div>}>
      <Component {...props} />
    </Suspense>
  );
};
