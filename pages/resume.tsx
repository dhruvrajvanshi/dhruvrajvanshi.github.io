import React from 'react'
import { DiRuby } from 'react-icons/di'
import { FaNodeJs, FaReact } from 'react-icons/fa'
import {
  SiAngular,
  SiGit,
  SiJava,
  SiPython,
  SiReactivex,
  SiSpring,
} from 'react-icons/si'

const tech = [
  {
    icon: <FaReact className='text-sky-500' />,
    text: 'React',
  },
  {
    icon: <SiAngular className='text-red-600' />,
    text: 'Angular',
  },
  {
    icon: <SiJava />,
    text: 'Java',
  },
  {
    icon: <SiSpring className='text-green-600' />,
    text: 'Spring',
  },
  {
    icon: <FaNodeJs className='text-green-600' />,
    text: 'Node JS',
  },
  {
    icon: <SiPython />,
    text: 'Python',
  },
  {
    icon: <SiGit className='text-orange-500' />,
    text: 'Git',
  },
  {
    icon: <DiRuby className='text-red-700' />,
    text: 'Ruby on rails',
  },
  {
    icon: <SiReactivex className='text-pink-700' />,
    text: 'Functional programming',
  },
]
export default function Resume() {
  return (
    <div className='px-8' style={{ maxWidth: '768px', margin: 'auto' }}>
      <h1 className='text-4xl font-extrabold mt-8 text-slate-700'>Resume</h1>
      <Section>
        <SectionHeader>Technologies</SectionHeader>
        <ul
          className='mt-4 flex space-x-6 flex-wrap justify-center text-center items-center'
          style={{ fontFamily: 'monospace' }}
        >
          {tech.map(({ icon, text }) => (
            <li key={text} className='flex items-center justify-center p-1'>
              <span className='mr-2'>{icon}</span> <span>{text}</span>
            </li>
          ))}
        </ul>
      </Section>

      <ExperienceSection />
    </div>
  )
}

function SectionHeader({ children }: { children: string }) {
  return <h2 className='text-3xl font-bold mt-4 text-slate-700'>{children}</h2>
}
function Section(props: React.HTMLProps<HTMLDivElement>) {
  return <section {...props} />
}

function ExperienceSection() {
  return (
    <Section>
      <SectionHeader>Experience</SectionHeader>

      <div>
        <Company
          company='Travelperk'
          location='Berlin'
          title='Software Developer'
          duration='JUN 2022 - Present'
        >
          <ul className='list-disc'>
            <li>
              End to end design and implementation of Custom fields to clients.
            </li>
            <li>Designed a core web library for data fetching.</li>
          </ul>
        </Company>

        <Company
          company='Glovo'
          location='Barcelona'
          title='Senior Backend Engineer (SRE)'
          duration='JUL 2021 - FEB 2022'
        >
          <ul className='list-disc'>
            <li>
              Built monitoring tools and dashboards for monitoring availability
              and performance metrics using Terraform and Datadog.
            </li>
          </ul>
        </Company>

        <Company
          company='Blackrock'
          location='India'
          title='Senior Software Engineer'
          duration='SEP 2018 - JUL 2020'
        >
          <ul className='list-disc'>
            <li>Designed and implemented the Regulatory Reporting platform.</li>
            <li>Mentored several interns and junior developers.</li>
          </ul>
        </Company>
        <Company
          company='Acadly'
          title='Frontend Lead'
          duration='NOV 2016 - AUG 2018'
          location='India'
        >
          Lead developer for the frontend React app along with occasional
          infrastructure and backend work.
          <SubsectionHeading>Learnings</SubsectionHeading>
          <ul className='list-disc'>
            <li>Writing tests retrospectively isn&apos;t feasible.</li>
            <li>
              Let components control their data fetching. Global state is not
              worth it.
            </li>
          </ul>
        </Company>
      </div>
    </Section>
  )

  function Company({
    company,
    title,
    duration,
    location,
    children,
  }: {
    company: string
    title: string
    duration: string
    location: string
    children: React.HTMLProps<HTMLDivElement>['children']
  }) {
    return (
      <div className='mt-4' style={{ lineHeight: '1.6', fontSize: '87%' }}>
        <h3 className='mb-1'>
          <span className='text-lg text-pink-600 font-bold'>
            {company}, {location}
          </span>
          <span className='text-slate-600 italic'>&nbsp;- {title}</span>
          <span className='text-sm text-slate-600 ml-2'>{duration}</span>
        </h3>

        <div>{children}</div>
      </div>
    )
  }
}

function SubsectionHeading({ children }: { children: string }) {
  return <div className='text-rose-600 font-semibold mt-1'>{children}</div>
}
