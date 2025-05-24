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
      <main className='pt-16 p-4 container mx-auto  max-w-4xl'>
        <h1>Welcome to Dhruv's Home Page!</h1>

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

        <section className='mt-4'>
          <h2>Writings</h2>
          <p>Here is a selected sample of my writings.</p>
          <ul>
            {posts.map((post) => (
              <li key={post.href}>
                <a href={post.href} className='text-xl mb-2 block'>
                  {post.title}
                </a>
                <p>{post.preview}</p>
              </li>
            ))}
          </ul>
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
  },
  {
    title: 'Making exceptions type safe in Typescript',
    href: 'https://medium.com/@dhruvrajvanshi/making-exceptions-type-safe-in-typescript-c4d200ee78e9',
    preview:
      'I show a way to do type-safe error propagation in Typescript using some advanced type system features.',
  },
]
