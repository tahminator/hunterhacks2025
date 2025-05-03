import styles from './Landing.module.css'
import LogoURL from '@assets/Logo.png'
import { Title, Stack, Text, Group, Box, Image, Button } from '@mantine/core'
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
      <Group w={'100%'} justify="flex-end" mb="sm">
        <Text size="lg">I'm allergic to</Text>
      </Group>
      <Stack align="flex-end" gap={'1.5rem'}>
        {textArray.map((text, index) => (
          <Title
            key={index}
            style={{
              fontSize: '3rem',
            }}
          >
            {text}
          </Title>
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
          <Button flex={2} color="olivine.9">
            Login
          </Button>
          <Button flex={1} color="olivine.8">
            Register
          </Button>
        </Group>
        <Button variant="outline" color={'rgba(0, 0, 0, 1)'}>
          Continue As Guest
        </Button>
      </Stack>
    </Box>
  )
}

export default LandingPage
