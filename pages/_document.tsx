import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    render(): JSX.Element {
        return (
            <Html className="h-screen">
                <Head />
                <body>
                    <Main />
                    <div id="portal_root" />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
