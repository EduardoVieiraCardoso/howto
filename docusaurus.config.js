const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');


/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Handbooks de infraestrutura',
  tagline: '“Nada é tão bom que não possa ser melhorado, qualquer um de nós está sempre em aprendizado. Quando achamos que já sabemos tudo, é o sinal de que nem começamos a aprender o básico, humildade!”',
  url: 'https://howto.educardoso.com.br',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/educardoso-favicon.ico',

  organizationName: 'Edu Cardoso', // Usually your GitHub org/user name.
  projectName: 'Base de Conhecimento', // Usually your repo name.
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },
 
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        gtag: {
          trackingID: 'G-TRV9LW1LHZ',
          anonymizeIP: true,
        },
        googleAnalytics: {
          trackingID: 'G-TRV9LW1LHZ',
          anonymizeIP: true,
        },
        sitemap: {
          changefreq: 'always',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'EduCardoso',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo_branco.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'Sistemas Operacionais/index',
            position: 'left',
            label: 'Sistemas Operacionais',
          },
          {
            type: 'doc',
            docId: 'Redes/index',
            position: 'left',
            label: 'Redes',
          },
          {
            type: 'doc',
            docId: 'Armazenamento/index',
            position: 'left',
            label: 'Armazenamento',
          },
          {
            type: 'doc',
            docId: 'Virtualização/index',
            position: 'left',
            label: 'Virtualização',
          },
          {
            type: 'doc',
            docId: 'eve-ng',
            position: 'left',
            label: 'eve-ng',
          },
          {to: '/blog', label: 'Blog', position: 'right'},
          {
            type: 'doc',
            docId: 'quemsou',
            label: 'About me',
            position: 'right',
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
