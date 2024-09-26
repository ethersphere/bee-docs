import React from "react";
import SearchBar from "@theme-original/SearchBar";
import AskCookbook from "@cookbookdev/docsbot/react";
import BrowserOnly from "@docusaurus/BrowserOnly";

/** It's a public API key, so it's safe to expose it here */
const COOKBOOK_PUBLIC_API_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmY1YWNhZjIxODNjMDQxZWNhN2Q3ZmIiLCJpYXQiOjE3MjczNzY1NTksImV4cCI6MjA0Mjk1MjU1OX0.oSqppcwE2Hln6_mTjmXy-Roz6znZ-KchgjfP9oM3m24";

export default function SearchBarWrapper(props) {
  return (
    <>
      <SearchBar {...props} />
      <BrowserOnly>
        {() => <AskCookbook apiKey={COOKBOOK_PUBLIC_API_KEY} />}
      </BrowserOnly>
    </>
  );
}
