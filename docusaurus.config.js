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
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'EduCardoso',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
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
            docId: 'Segurança/index',
            position: 'left',
            label: 'Segurança',
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
          {to: '/blog', label: 'Blog', position: 'left'},
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
