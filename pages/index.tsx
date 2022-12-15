import Head from 'next/head'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import blinkingCursor from '../styles/blinking-cursor.module.css'
import { FaReact, FaJava, FaNodeJs, FaAngular } from 'react-icons/fa'
import { DiRuby, DiPython, DiDjango } from 'react-icons/di'
import {
  SiRubyonrails,
  SiSpring,
  SiKotlin,
  SiScala,
  SiTypescript,
} from 'react-icons/si'

function* repeat<T>(value: T, times: number) {
  for (let i = 0; i < times; i++) {
    yield value
  }
}
const textItems = [
  'f',
  'fi',
  'fir',
  'firs',
  ...repeat('first', 12),
  'firs',
  'fir',
  'fi',
  'f',
  '',
  'n',
  'ne',
  'nex',
  ...repeat('next', 12),
  'nex',
  'ne',
  'n',
  '',
]
export default function Home() {
  const [dynText, setDynText] = useState('first')

  useEffect(() => {
    let i = 0

    const interval = setInterval(() => {
      setDynText(textItems[i])

      i = (i + 1) % textItems.length
    }, 200)
    return () => {
      clearInterval(interval)
    }
  }, [])

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
              WebkitBackgroundClip: 'text',
              backgroundImage: 'linear-gradient(90deg, #7928CA, #FF0080)',
            }}
          >
            Dhruv Rajvanshi
          </span>
          , tech lead for your <br />
          {dynText}
          <BlinkingCursor /> million users.
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
const feFwChoices = [
  <div key='react' className='flex justify-center space-x-2'>
    <FaReact className='text-sky-500' key='react' />
  </div>,

  <div key='angular' className='flex justify-center space-x-2'>
    <FaAngular className='text-red-600' key='angular' />
  </div>,
]

const beChoices = [
  <div key='ruby' className='flex justify-center space-x-2'>
    <DiRuby className='text-red-600' />
    <SiRubyonrails className='text-red-600' />
  </div>,
  <div key='jvm' className='flex justify-center space-x-2'>
    <FaJava className='text-blue-700' />
    <SiScala className='text-red-600' />
    <SiSpring className='text-green-600' />
  </div>,
  <div key='python' className='flex justify-center space-x-2'>
    <DiPython />
    <DiDjango />
  </div>,

  <div key='nodejs' className='flex justify-center space-x-2'>
    <FaNodeJs className='text-green-600' />
    <SiTypescript className='text-blue-500' />
  </div>,
]
function TechStacksSection() {
  return (
    <section className='mt-16 text-center'>
      <h2 className='text-4xl font-extrabold'>
        Expert in your preferred tech stack
      </h2>
      <div>
        <h3 className='text-3xl mt-4 font-semibold'>From front</h3>
        <ChoiceIconAnimator choices={feFwChoices} />
      </div>
      <div>
        <h3 className='text-3xl mt4 font-semibold'>To back</h3>
        <ChoiceIconAnimator choices={beChoices} />
      </div>
    </section>
  )
}

function BlinkingCursor() {
  return <span className={blinkingCursor.blink}>|</span>
}
function ChoiceIconAnimator({
  choices,
}: {
  choices: ReadonlyArray<React.ReactNode>
}) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => {
        const nextIndex = (i + 1) % choices.length
        return nextIndex
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [choices])
  return <div className='text-4xl'>{choices[index]}</div>
}
