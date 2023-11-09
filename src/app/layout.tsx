import React from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Spotify Playlist Embed</title>
      </head>
      <body>{children}</body>
    </html>
  )
}
