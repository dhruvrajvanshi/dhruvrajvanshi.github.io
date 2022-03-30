import type { NextPage } from 'next'
import Head from 'next/head'
import { Heading, Box, Link, Text, Stack, BoxProps, List, ListItem } from '@chakra-ui/react'
import { Span } from '@/ui/span'
import { colors, hsl } from '@/theme'
import { sx } from '@/ui'
import { css } from '@emotion/react'
import { omit } from '@/lib'

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
    fontSize: '2xl',
    color: colors.orange[500],
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: '8px',
    marginBottom: '8px'
  })

  return (
    <Box sx={{ width: '100%' }}>
      <Head>
        <title>Dhruv&apos;s Home Page</title>
        <meta name="description" content="Dhruv's home page" />
      </Head>

      <Stack as='main' sx={mainSx}>
        <Section>
          <Heading as='h1' color={colors.gray[700]} mt='16'>
            Dhruv&apos;s Home Page
          </Heading>

          <Box as='p' sx={subHeadingSx} >
            I&apos;m a software engineer.
          </Box>
        </Section>
        <Section bgColor={colors.teal[400]}>
          <Text as='p' sx={paraSx}>
            In my spare time, I like to build programming languages,
            compilers and VMs. Check out &nbsp;
            <a href="https://github.com/dhruvrajvanshi/hades-lang">Hades language</a>,
            which is the programming language I&apos;m working on right now.
          </Text>
          <Text as='p' sx={paraSx}>
            Apart from all this, I like to play drums and guitar,
            and in general learning about music theory.
          </Text>
        </Section>

        <Section bgColor={colors.orange[300]}>
          <List textAlign={'center'}>
            <ListItem>
              <Link href='https://www.linkedin.com/in/dhruv-rajvanshi-186a0267'>LinkedIn</Link>
            </ListItem>
            <ListItem>
              <Link href='https://github.com/dhruvrajvanshi/'>Github</Link>
            </ListItem>
          </List>
        </Section>
      </Stack>
    </Box>
  )

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
