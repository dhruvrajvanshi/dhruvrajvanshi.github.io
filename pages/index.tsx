import Head from 'next/head'
import Image from 'next/image'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Dhruv&apos; Home Page</title>
        <meta
          name='description'
          content='Dhruv Rajvanshi. Hire me for your software needs'
        />
      </Head>

      <section className='max-w-5xl mx-auto px-8 text-center mb-8'>
        <div className='text-center'>
          <Image
            src='/images/avatar.jpg'
            alt='avatar'
            width={160}
            height={160}
            className='rounded-full border-blue-900 mx-auto mt-20 drop-shadow-md'
          />
        </div>

        <h1 className='text-slate-900 text-4xl text-center mt-12 mx-16 font-extrabold'>
          <span
            className='text-transparent'
            style={{
              backgroundClip: 'text',
              backgroundImage: 'linear-gradient(90deg, #7928CA, #FF0080)',
            }}
          >
            Dhruv Rajvanshi
          </span>
          , tech lead for your first million users.
        </h1>

        <div className='mx-auto mt-8 text-slate-600'>
          I specialize in web development. I can help you with bootstraping your
          next Sass product and scale it to the moon.
        </div>

        <a href='mailto:d@rajv.dev'>
          <button className='bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white mt-4 px-3 py-2 text-center rounded-md font-semibold'>
            Contact Me
          </button>
        </a>
      </section>
    </div>
  )
}
