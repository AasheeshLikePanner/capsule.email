"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

const NextNProgressClient = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <ProgressBar
        height="2px"
        color="#000"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default NextNProgressClient;