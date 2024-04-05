import { readFile } from 'node:fs/promises'

import satori, { type SatoriOptions } from 'satori'
import sharp from 'sharp'

export interface OgOptions {
  title: string
}

export async function createOgImage({ title }: OgOptions): Promise<Buffer> {
  const logo = await readFile('./public/logo-inverted.png')
  const interRegular = await readFile('./public/fonts/og/inter-regular.ttf')
  const interSemiBold = await readFile('./public/fonts/og/inter-semibold.ttf')

  const options = {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Inter',
        style: 'normal',
        weight: 400,
        data: interRegular
      },
      {
        name: 'Inter',
        style: 'normal',
        weight: 600,
        data: interSemiBold
      }
    ]
  } satisfies SatoriOptions

  const markup = {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#141415',
        fontFamily: 'Inter'
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: 96,
              position: 'absolute',
              left: 64,
              top: 64
            },
            children: [
              // Icon.
              {
                type: 'img',
                props: {
                  width: 96,
                  height: 96,
                  src: logo.buffer
                }
              },

              // Domain name + Page title.
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16
                  },
                  children: [
                    // Domain name.
                    {
                      type: 'div',
                      props: {
                        style: {
                          color: '#f9fafb',
                          opacity: 0.5,
                          fontSize: 48
                        },
                        children: 'vm.codes'
                      }
                    },

                    // Page title.
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          flexWrap: 'wrap',
                          justifyContent: 'center',
                          width: 'auto',
                          maxWidth: 750,
                          fontSize: 48,
                          fontWeight: 600,
                          lineHeight: 1.25,
                          color: '#f9fafb'
                        },
                        children: title
                      }
                    }
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  }

  const svg = await satori(markup, options)
  const png = await sharp(Buffer.from(svg)).png().toBuffer()

  return png
}
