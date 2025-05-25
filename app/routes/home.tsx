import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dhruv's home page" },
    { name: 'description', content: "Welcome to Dhruv's home page!" },
  ]
}

export default function Home() {
  return (
    <>
      <main className='pt-16 p-4 container'>
        <h1 className='text-3xl font-semibold mb-4'>
          Welcome to Dhruv's Home Page!
        </h1>

        <p>
          I build software. You can find some of my work on{' '}
          <a href='https://github.com/dhruvrajvanshi'>GitHub</a>.
        </p>

        <p>
          I'm also available for consulting and freelance work. I'm proficient
          full stack web development, particularly with React, TypeScript, Java
          and Kotlin.
        </p>
        <p>
          You can contact me via email at{' '}
          <a href='mailto:dhruv@rajv.dev'>dhruv@rajv.dev</a> or connect with me
          on{' '}
          <a href='https://www.linkedin.com/in/dhruv-rajvanshi-186a0267/'>
            LinkedIn
          </a>
          .
        </p>

        <section className='mt-6'>
          <h2 className='text-2xl mb-2'>Articles</h2>
          {posts.map((post) => (
            <article key={post.href} className='mb-5'>
              <header className='mb-1 text-lg font-semibold'>
                <h3>
                  <a href={post.href} className='unstyled'>
                    {post.title}
                  </a>
                </h3>
              </header>
              <div className='text-sm text-dimmed mb-1'>{post.published}</div>
              <div className='mb-1'>{post.preview}</div>
              <a href={post.href}>Read more</a>
            </article>
          ))}
        </section>
      </main>
    </>
  )
}

const posts = [
  {
    title: 'Advanced typescript patterns',
    href: 'https://medium.com/@dhruvrajvanshi/advanced-typescript-patterns-6cf8826c7944',
    preview:
      'Some cool things that I discovered in Typescript that allow me to statically check pretty neat invariants and reduce type/interface declaration boilerplate using type inference.',
    published: 'May 9, 2018',
  },
  {
    title: 'Making exceptions type safe in Typescript',
    href: 'https://medium.com/@dhruvrajvanshi/making-exceptions-type-safe-in-typescript-c4d200ee78e9',
    preview:
      'I show a way to do type-safe error propagation in Typescript using some advanced type system features.',
    published: 'Feb 11, 2018',
  },
]
