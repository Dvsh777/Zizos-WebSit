import { getBaseURL } from "@lib/util/env"
import { Metadata, Viewport } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

// viewportFit "cover" lets the sticky mobile bars respect the iPhone home
// indicator through env(safe-area-inset-bottom). The theme color tints the
// browser chrome on Android Chrome and iOS Safari.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0c",
  colorScheme: "dark",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" data-mode="dark">
      <head>
        <link rel="ucp" href="/.well-known/ucp" />
      </head>
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
