// main tools
import Document, { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

// types
import { DocumentContext, DocumentInitialProps } from 'next/document'

export default class MyDocument extends Document {
  private keywords = [
    'blog',
    'josejmv',
    'next.js',
    'cypress',
    'react.js',
    'portafolio'
  ]

  static getInitialProps = async (
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> => {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet='utf-8' />
          <meta name='author' content='JoseJMV' />
          <meta name='copyright' content='JoseJMV' />
          <meta name='keywords' content={this.keywords.join()} />
          <link rel='shortcut icon' href='/assets/logos/icon-192x192.png' />
          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css2?family=Montserrat&family=Oswald&family=Anton&display=swap'
          />
          <Script
            id='sc-script'
            src={process.env.NEXT_PUBLIC_SMART_CAT_SCRIPT_URL}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
