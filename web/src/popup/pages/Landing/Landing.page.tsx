import styles from './Landing.module.css'
import LogoURL from '@assets/Logo.png'
import {
  Title,
  Stack,
  Text,
  Group,
  Box,
  Image,
  Button,
  Drawer,
} from '@mantine/core'

import { TypeAnimation } from 'react-type-animation'
import { useGuestLoginMutation } from '@base/popup/api/auth'
import { useDisclosure } from '@mantine/hooks'
import { LoginCard } from '@base/popup/components/LoginCard/Login.card'
import { RegisterCard } from '@base/popup/components/RegisterCard/Register.card'

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
  const [loginOpened, { open: loginOpen, close: loginClose }] =
    useDisclosure(false)
  const [registerOpened, { open: registerOpen, close: registerClose }] =
    useDisclosure(false)
  const { mutate: loginGuest } = useGuestLoginMutation()
  const allergens = [
    'Gluten',
    'Peanuts',
    'Pistachios',
    'Corn',
    'Soy',
    'Shellfish',
    'Avocados',
  ]

  return (
    <>
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
            <Button flex={2} color="olivine.8" onClick={loginOpen}>
              Login
            </Button>
            <Button flex={1} color="olivine.6" onClick={registerOpen}>
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
      <Drawer
        withCloseButton={false}
        position="bottom"
        opened={loginOpened}
        onClose={loginClose}
        classNames={{
          content: styles.authCardHeader,
        }}
      >
        <LoginCard close={loginClose} />
      </Drawer>
      <Drawer
        size={'lg'}
        withCloseButton={false}
        position="bottom"
        opened={registerOpened}
        onClose={registerClose}
        classNames={{
          content: styles.authCardHeader,
        }}
      >
        <RegisterCard close={registerClose} />
      </Drawer>
    </>
  )
}

export default LandingPage
