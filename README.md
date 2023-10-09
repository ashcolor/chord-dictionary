# Chord Dictionary

## ダウンロード

[Chrome ウェブストア](https://chrome.google.com/webstore/detail/chord-dictionary/lnefagbhokamcaedbeopnhdabkcemkcf)

## 開発者向け情報

### 使用ライブラリ

-   [Vite](https://ja.vitejs.dev/)
-   [Vue 3](https://ja.vuejs.org/)
-   [VueUse](https://vueuse.org/)
-   [Vue i18n](https://vue-i18n.intlify.dev/)
-   [pinia](https://pinia.vuejs.org/introduction.html)
-   [Vuetify](https://vuetifyjs.com/)
-   [Storybook](https://storybook.js.org/)

### インストール

```:bash
yarn
```

### ローカルサーバの起動

```:bash
yarn dev
```

### Storybook 起動

```:bash
yarn storybook
```

### Chrome 拡張機能としての動作確認

1. Chrome で`chrome://extensions/`を開く

2. 右上の`デベロッパー モード`がオンになっていることを確認

3. 「パッケージ化されていない拡張機能を読み込む」をクリック

4. `dist`ディレクトリをブラウザ画面にドラッグ&ドロップ

5. 任意のサイト上で右上の拡張機能のアイコンをクリック

## アップロード用の zip の作成

```:bash
yarn build
yarn build-zip
```
