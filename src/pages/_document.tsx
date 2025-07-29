import { Html, Head, Main, NextScript , DocumentProps} from "next/document";

export default function Document(props: DocumentProps) {
  return (
    <Html lang="en">
      <Head />
      <link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700,800&display=swap"
/>

      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
