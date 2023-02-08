import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
            rel="stylesheet"
          />
          <meta charSet="UTF-8" />
        </Head>
        <body>
          <Main />
          <NextScript />
          <svg width="0" height="0">
            <linearGradient id="lgrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                style={{
                  stopColor: "rgba(190, 115, 237, 1)",
                  stopOpacity: 1,
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: "rgba(255, 135, 108, 1)",
                  stopOpacity: 1,
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: "rgba(255, 188, 108, 1)",
                  stopOpacity: 1,
                }}
              />
            </linearGradient>
          </svg>
          <svg width="0" height="0">
            <linearGradient id="gradPurple" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop
                offset="0%"
                style={{
                  stopColor: "#5C068C",
                  stopOpacity: 1,
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: "#A374BC",
                  stopOpacity: 1,
                }}
              />
              <stop
                offset="100%"
                style={{
                  stopColor: "#A374BC",
                  stopOpacity: 1,
                }}
              />
            </linearGradient>
          </svg>
          <svg width="0" height="0">
            <defs>
              <linearGradient
                id="gradient"
                x1="2.80078"
                y1="20.3279"
                x2="24.1708"
                y2="14.4256"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#BE73ED" />
                <stop offset="0.510417" stopColor="#FF876C" />
                <stop offset="1" stopColor="#FFBC6C" />
              </linearGradient>
            </defs>
          </svg>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
