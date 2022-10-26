import Link from "next/link";
import React from "react";
import styles from "./Header.module.css";
import Logo from "./Logo";
import commonsConfig from "../commons.config";

const Header = () => {
  return (
    <header className={styles.Container}>
      <Link href={"/"}>
        <a className={styles.Title}>
          <Logo title={commonsConfig.blogName} />
        </a>
      </Link>
      <Link href={"/posts"}>
        <a className={styles.Link}>
          <div>{"포스트"}</div>
        </a>
      </Link>
      <Link href={"/about"}>
        <a className={styles.Link}>
          <div>{"About Me"}</div>
        </a>
      </Link>
    </header>
  );
};

export default Header;
