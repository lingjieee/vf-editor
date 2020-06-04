import { defineConfig } from 'dumi';

export default defineConfig({
    mode: 'site',
    logo: 'https://cdn-blog.jieee.xyz/img/fe-128.png',
    title: 'WF Editor',
    favicon: 'https://cdn-blog.jieee.xyz/img/fe-24.ico',
    navs: [
        null,
        {
            title: 'GitHub',
            path: 'https://github.com/lingjieee/wf-editor',
        },
        {
            title: 'Changelog',
            path: 'https://github.com/lingjieee/wf-editor/blob/master/CHANGELOG.md',
        },
    ],
    exportStatic: {},
    styles: [],
    scripts: [],
    externals: {},
});