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
          // Debug defaults to true in dev, false in prod
          debug: undefined,
          // Will be passed to @docusaurus/theme-classic.
          theme: {
            customCss: [require.resolve('./src/css/custom.css')],
          },
          // Will be passed to @docusaurus/plugin-content-docs (false to disable)
          docs: {},
          // Will be passed to @docusaurus/plugin-content-blog (false to disable)
          blog: {},
          // Will be passed to @docusaurus/plugin-content-pages (false to disable)
          pages: {},
          // Will be passed to @docusaurus/plugin-content-sitemap (false to disable)
          sitemap: {
            changefreq: 'weekly',
            priority: 0.5,
            ignorePatterns: ['/tags/**'],
            filename: 'sitemap.xml',
          },
          // Will be passed to @docusaurus/plugin-google-gtag (only enabled when explicitly specified)
          gtag: {
            trackingID: 'G-TRV9LW1LHZ',
            anonymizeIP: false,
          },
          
          // Will be passed to @docusaurus/plugin-google-analytics (only enabled when explicitly specified)
          googleAnalytics: {},
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
