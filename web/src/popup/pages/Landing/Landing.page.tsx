import { authenticateGuest } from '@base/popup/api/authenication'
import styles from './Landing.module.css'
import LogoURL from '@assets/Logo.png'
import { Title, Stack, Text, Group, Box, Image, Button } from '@mantine/core'
import { useMutation } from '@tanstack/react-query'

import { TypeAnimation } from 'react-type-animation'
import { useContext } from 'react'
import { AuthContext } from '@base/popup/contexts/AuthContext'

const TypingText = () => {
  return (
    <TypeAnimation
      sequence={[
        "I'm allergic to...",
        2500,
        'My coworker',
        500,
        "My coworker can't eat...",
        2500,
        'My girlfriend is allergic to...',
        3000,
      ]}
      wrapper="span"
      speed={1}
      style={{ display: 'inline-block' }}
      repeat={Infinity}
      preRenderFirstString={true}
    />
  )
}
interface TextCutoutBackgroundProps {
  textArray: string[]
}

function TextCutoutBackground({ textArray }: TextCutoutBackgroundProps) {
  return (
    <Box
      style={{ zIndex: 0 }}
      py={'10px'}
      px={'20px'}
      pos={'absolute'}
      right={'0'}
    >
      <Group w={'100%'} justify="flex-end" mb="xs">
        <Text size="lg" c={'rgba(216, 111, 59, 1.0)'}>
          <TypingText />
        </Text>
      </Group>
      <Stack align="flex-end" mt={'-1rem'} gap={'1.5rem'}>
        {textArray.map((text, index) => (
          <Box key={index} h={'2.5rem'}>
            <Title
              style={{
                fontSize: '3.4rem',
              }}
              className={styles.landingText}
            >
              {text}
            </Title>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}

function GradientOverlay() {
  return (
    <Box
      pos={'absolute'}
      bottom={'0'}
      w={'100%'}
      h={'350px'}
      style={{ zIndex: '2' }}
      id={styles.landingGradient}
    ></Box>
  )
}

function LandingPage() {
  const { refetchLogin } = useContext(AuthContext)

  const allergens = [
    'Gluten',
    'Peanuts',
    'Pistachios',
    'Corn',
    'Soy',
    'Shellfish',
    'Avocados',
  ]

  const mutateGuest = useMutation({
    mutationFn: () => {
      return authenticateGuest()
    },
  })

  const loginGuest = () => {
    mutateGuest
      .mutateAsync()
      .then(() => refetchLogin())
      .catch(() => {
        alert('An error occured. Could not post the announcement.')
      })
  }

  return (
    <Box h={'100%'} id={styles.landingContainer}>
      <TextCutoutBackground textArray={allergens} />
      <Box pos={'absolute'} top={'170px'} mx={'50'} w={'60%'}>
        <Image src={LogoURL} style={{ zIndex: 99 }} />
      </Box>
      <GradientOverlay />
      <Stack
        px="10"
        w={'100%'}
        pos={'absolute'}
        bottom={'30px'}
        style={{ zIndex: 99 }}
      >
        <Group>
          <Button flex={2} color="olivine.8">
            Login
          </Button>
          <Button flex={1} color="olivine.6">
            Register
          </Button>
        </Group>
        <Button
          onClick={() => loginGuest()}
          variant="outline"
          color={'rgba(0, 0, 0, 1)'}
        >
          Continue As Guest
        </Button>
      </Stack>
    </Box>
  )
}

export default LandingPage
