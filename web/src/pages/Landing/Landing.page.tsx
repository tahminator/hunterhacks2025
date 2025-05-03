import LogoURL from '@assets/Logo.png'
import { Title, Stack, Text, Group, Box, Image } from '@mantine/core'
interface TextCutoutBackgroundProps {
  textArray: string[]
}

function TextCutoutBackground({ textArray }: TextCutoutBackgroundProps) {
  return (
    <Box
      style={{ zIndex: -1 }}
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
    <Box h={'100%'}>
      <TextCutoutBackground textArray={allergens} />
      <Stack
        mx={'50'}
        w={'100%'}
        h={'95%'}
        justify="center"
        style={{ zIndex: 99 }}
      >
        <Image w={'60%'} src={LogoURL} />
      </Stack>
    </Box>
  )
}

export default LandingPage
