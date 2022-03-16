import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Dhruv&apos;s Home Page</title>
        <meta name="description" content="Dhruv's home page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Dhruv&apos;s Home Page
        </h1>

        <p className={styles.description}>
          I&apos;m a software engineer.
        </p>
        <p className={styles.subDescription}>
          In my spare time, I like to build programming languages,
          compilers and VMs. Check out &nbsp;
          <a href="https://github.com/dhruvrajvanshi/hades-lang">Hades language</a>,
          which is the programming language I&apos;m working on right now.
        </p>
        <p className={styles.subDescription}>
          Apart from all this, I like to play drums and guitar,
          and in general learning about music theory.
        </p>


        <section className={styles.profileLinks}>
          <ul>
            <li>
              <a href='https://www.linkedin.com/in/dhruv-rajvanshi-186a0267'>LinkedIn</a>
            </li>
            <li>
              <a href='https://github.com/dhruvrajvanshi/'>Github</a>
            </li>
          </ul>
        </section>
        
      </main>
    </div>
  )
}

export default Home
