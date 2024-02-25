
# gp

このアプリケーションは、特定のキーワードとオプションを受け取り、それに基づいてGPT-4にクエリを送信し、結果をクリップボードにコピーするコマンドラインツールです。
clip.exe に依存しているのでWindows専用のアプリケーションになります。

## インストール

依存関係をインストールするには、以下のコマンドを実行してください。

```bash
bun install
```

## 使用方法

アプリケーションは、最初の引数としてキーワードを受け取り、それに続く任意の数の引数をオプションとして受け取ります。例えば、以下のように使用できます。

```bash
bun run src/index.ts func5 指定したキーワードで登録されているテンプレートを呼び出す関数
```

以下がクリップボードに入ります
```
callRegisteredTemplateWithKeyword, fetchTemplateByKeyword, getRegisteredTemplateByKeyword, retrieveTemplateWithKeyword, loadTemplateUsingKeyword
```

## バッチファイル

Windowsユーザーの場合、`gp.bat`ファイルを使用してアプリケーションを簡単に実行できます。

```bat
@echo off
cd c:\Users\unok\git\gp
bun src/index.ts %*
exit
```

このバッチファイルを使用することで、コマンドプロンプトから直接コマンドを実行できます。

## ライセンス

このアプリケーションは[MITライセンス](LICENSE)の下で公開されています。