import type { NextPage } from 'next'
import Head from 'next/head'
import { colors, theme } from '@/theme'
import { sx } from '@/ui'
import { omit } from '@/lib'
import { FiMail, FiGithub, FiLinkedin } from 'react-icons/fi'
import { Box, BoxProps, Link, ListItem, Stack } from '@mui/material'

const Home: NextPage = () => {
  const mainSx = sx({
    width: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  })
  const paraSx = sx({
    textAlign: 'center',
    fontSize: 'large',
    lineHeight: '1.5',
    marginTop: '16px',
    marginBottom: '16px',
  })

  const subHeadingSx = sx({
    fontSize: 'x-large',
    color: colors.orange[800],
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '8px',
  })

  const headingSx = sx({
    textAlign: 'center',
    color: colors.grey[900],
    ...theme.typography.h2,
    marginTop: '40px',
    fontWeight: 'bold',
    marginBottom: '16px'
  })

  return (
    <Box sx={{ width: '100%' }}>
      <Head>
        <title>Dhruv&apos;s Home Page</title>
        <meta name="description" content="Dhruv's home page" />
      </Head>

      <Stack sx={mainSx}>
        <Section>
          <Box component='h1' sx={headingSx}>
            Dhruv&apos;s Home Page
          </Box>

          <Box sx={subHeadingSx}>
            I&apos;m a software engineer.
          </Box>
        </Section>
        <Section sx={{ backgroundColor: colors.teal[400] }}>
          <Box component='p' sx={paraSx}>
            In my spare time, I like to build programming languages,
            compilers and VMs. Check out &nbsp;
            <a href="https://github.com/dhruvrajvanshi/hades-lang">Hades language</a>,
            which is the programming language I&apos;m working on right now.
          </Box>
          <Box component='p' sx={paraSx}>
            Apart from all this, I like to play drums and guitar,
            and in general learning about music theory.
          </Box>
        </Section>

        <Section sx={{ backgroundColor: colors.orange[300] }}>
          <ContactList />
        </Section>
      </Stack>
    </Box>
  )

  function ContactList() {
    const listSx = sx({
      'li': {
        display: 'inline-block',
        margin: '8px',
      }
    })
    return <Stack direction='row' sx={listSx} role='list'>
      {
        links().map(it => (
          <ListItem key={it.href}>
            <Link href={it.href} id={it.label} textAlign='center' display={'flex'} flexDirection='column' alignItems={'center'}>
              <it.icon />
              <Box
                component='label'
                htmlFor={it.label}
                fontSize='md'
              >{it.label}</Box>
            </Link>
          </ListItem>
        ))
      }
    </Stack>

    function links() {
      return CONTACT_LINKS
    }
  }

  function Section(props: BoxProps) {
    const sectionContentSx = sx({
      maxWidth: '1024px',
    })

    const sectionSx = sx({
      padding: '16px 8px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '0px !important',
      ...props.sx,
    })

    return <Box {...omit(props, 'children')} sx={sectionSx}>
      <Box sx={sectionContentSx}>
        {props.children}
      </Box>
    </Box>
  }
}

export default Home

const CONTACT_LINKS = [
  {
    href: 'mailto:d@rajv.dev',
    label: 'Email',
    icon: FiMail,
  },
  {
    href: 'https://www.linkedin.com/in/dhruv-rajvanshi-186a0267',
    label: 'LinkedIn',
    icon: FiLinkedin
  },
  {
    href: 'https://github.com/dhruvrajvanshi/',
    label: 'Github',
    icon: FiGithub,
  },
] as const
