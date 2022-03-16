import fs from 'fs/promises'
import path from 'path'
import { GetStaticPathsResult, GetStaticProps } from 'next'
import Head from 'next/head'
import { bundleMDX } from 'mdx-bundler'
import { getMDXComponent } from 'mdx-bundler/client'
import React from 'react'
import c from '../../styles/Article.module.css'

export default function Article(props: Props) {
  if (!props.mdx) {
    return null
  }
  const Component = getMDXComponent(props.mdx.code)
  return <main className={c.container}>
    <Head>
      <title>Article</title>
    </Head>
    <article>
      <Component />
    </article>
  </main>
}

type Props = {
  mdx: {
    code: string
  }
}
export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const slug = ctx.params?.slug as string
  const articlePath = path.join(process.cwd(), 'articles', `${slug}.mdx`)
  const mdx = await bundleMDX({
    file: articlePath,
  })
  return {
    props: {
      mdx
    }
  }
}

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const files = await fs.readdir('articles')
  return {
    paths: files.map(it => `/articles/${it}`),
    fallback: true
  }
}