interface Frontmatter {
  title: string
  published_on?: string
  [key: string]: unknown
}
export function recentPosts(ctx: {
  routes: { urlPath: string; frontmatter: Frontmatter }[]
}) {
  const posts = ctx.routes
    .filter(
      (route) => route.urlPath.startsWith('/p/') && !route.frontmatter.draft,
    )
    .map((route) => ({
      ...route,
      href: route.urlPath,
    }))
    .sort(
      (a, b) =>
        parseDate(a.frontmatter.published_on) -
        parseDate(b.frontmatter.published_on),
    )
    .reverse()
  return posts
}
function parseDate(dateString?: string): number {
  if (!dateString) return 0
  return new Date(dateString).getTime()
}
