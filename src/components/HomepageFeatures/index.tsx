import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Operation Systems',
    Svg: require('@site/static/img/linux-svgrepo-com.svg').default,
    description: (
      <>
      Exemplos práticos que ajudarão você a entender ainda melhor os comandos do Linux.
      </>
    ),
  },
  {
    title: 'Network',
    Svg: require('@site/static/img/network-svgrepo-com.svg').default,
    description: (
      <>
      Resumos sobre protocolos de redes, boas práticas e exemplos de uso.
      </>
    ),
  },
  {
    title: 'Storage',
    Svg: require('@site/static/img/hard-disc-memory-svgrepo-com.svg').default,
    description: (
      <>
      Abordagem sobre sistemas de armazenamento, equipamentos e boas práticas.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
