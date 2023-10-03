[Vite]
[Vue 3]
[Vue i18n](https://vue-i18n.intlify.dev/)

[BootstrapVue](https://bootstrap-vue.org/)

# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).

ターミナルで Vite を起動していない場合は、今すぐ起動してください。

npm run dev

をインストールする
ビルドが完了したら、Chrome または Edge を開いて に移動します chrome://extensions。開発者モードスイッチを必ずオンにしてください。

クロム 角
Chrome 開発者モードのスイッチ エッジ開発者モードスイッチ
右上隅にあります 左側のサイドバーにあります
dist フォルダーを拡張機能ダッシュボードにドラッグしてインストールします。拡張機能のアイコンが上部のバーに表示されます。アイコンは拡張機能名の最初の文字になります。

Chrome 拡張機能アイコンのコンテキスト メニュー

Vite
拡張機能アイコンを見つけたら、それを右クリックし、「ポップアップ ウィンドウを検査」を選択します。これにより、ポップアップとポップアップ開発ツール ウィンドウが開きます。変更を加えている間ポップアップを開いたままにするために、ポップアップを検査する必要があります。
