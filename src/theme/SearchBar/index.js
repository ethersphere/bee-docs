import React from "react";
import SearchBar from "@theme-original/SearchBar";
import BrowserOnly from "@docusaurus/BrowserOnly";


export default function SearchBarWrapper(props) {
  return (
    <>
      <SearchBar {...props} />
    </>
  );
}
