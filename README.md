# 借入条件・返済総額ナビ
公式商品条件と独立した返済・おまとめ計算機。F計画特別第6号。

## 開発
Node.js 22以上、外部パッケージなし。
```
npm run build
npm test
```
Cloudflare Pages: `main`、フレームワークなし、ビルド `npm run build`、出力 `dist`。
公開先候補: https://loan-total-comparison-navi.pages.dev/ （管理画面での公開確認前は未確定）。別URLの場合 `SITE_URL` に確定オリジンを設定して再ビルド。

## ソース
- `src/loan.mjs`: 計算エンジン。1円単位、月利、月ごと四捨五入、最終回精算。
- `src/app.mjs`: ブラウザ入力・結果表示。入力値を保存・送信しない。
- `src/build.mjs`: 静的35ページ生成、SEO、CSP。
- `content/products.json`: 10社12商品。主要条件を公式本文で確認した9商品と、本文再確認待ち1件・行政登録照合待ち2件。
- `content/ads.json`: 全広告停止。承認・併用・法的表示・カテゴリ除外確認を満たす通常広告リンクのみ有効化可能。

既存 `loan-sougaku-pages.zip`（5ファイル、2026-11-01作成）を読み、月利元利均等モデルと総額比較の設計を引き継いだ。旧版の単純な月額×回数から、毎月の利息丸め・最終回精算に再実装し、3件から5件へ拡張。独立した `MORRY1992/loan-rakuchinder` は変更していない。

## 現状と運用
`docs/STATUS.md`, `docs/OPERATIONS.md`, `docs/MONETIZATION.md` を参照。公開・広告申請・自動更新の完了をソースだけで推定しない。
