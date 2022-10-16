import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';

//function HomepageHeader() {
//  const {siteConfig} = useDocusaurusContext();
//  return (
//    <header className={clsx('hero hero--primary', styles.heroBanner)}>
//      <div className="container">
//        <h1 className="hero__title">{siteConfig.title}</h1>
//        <p className="hero__subtitle">{siteConfig.tagline}</p>
//        por Gilmar de Freitas Vasconcelos
//      </div>
//    </header>
//  );
//}

//export default function Home(): JSX.Element {
//  const {siteConfig} = useDocusaurusContext();
//  return (
//    <Layout
//      title={` Base de Conhecimentos`} // Original - title={` Base de Conhecimentos ${siteConfig.title}`}
//      description="Description will go into a meta tag in <head />">
//      <HomepageHeader />
//      <main>
//        <HomepageFeatures />
//      </main>
//    </Layout>
//  );
//}
//

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Base de Conhecimentos`} // Original - title={` Base de Conhecimentos ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <div className={styles.heroBanner}>
        <img  className={styles.logo_educardoso} src='/img/logo_branco.svg'></img>
      </div>
      <main>
      <HomepageFeatures />
      </main>
    </Layout>
  );
}

