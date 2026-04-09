import './globals.css'
import { Space_Grotesk } from "next/font/google"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
})

export const metadata = {
  title: "BrainDesk AI",
  description: "Multi-Agent Hybrid Memory System",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.className}>
        {children}
      </body>
    </html>
  )
}