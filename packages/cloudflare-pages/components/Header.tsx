import Link from "next/link";
import React from "react";
import styles from "./Header.module.css";
import Logo from "./Logo";
import commonsConfig from "../commons.config";

const Header = () => {
  return (
    <header className={styles.Header}>
      <div className={styles.Nav_wrapper}>
        <Link href={"/"}>
          <a className={styles.Title}>
            <Logo title={commonsConfig.blogName} />
          </a>
        </Link>
        <nav className={styles.Nav}>
          <Link href={"/posts"}>
            <a className={styles.Link}>
              <div>{"Posts"}</div>
            </a>
          </Link>
          <Link href={"/about"}>
            <a className={styles.Link}>
              <div>{"About Me"}</div>
            </a>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
