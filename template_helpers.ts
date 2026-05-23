interface Frontmatter {
  title: string
  published_on?: string
  [key: string]: unknown
}
export function recentPosts(ctx: {
  routes: { urlPath: string; frontmatter: Frontmatter }[]
}) {
  const posts = ctx.routes.filter(
    (route) => route.urlPath.startsWith('/p/') && !route.frontmatter.draft,
  )
  return posts
}
