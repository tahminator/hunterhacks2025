import { Title, Stack, Text, Group, Box } from '@mantine/core'

interface TextCutoutBackgroundProps {
  textArray: string[]
}

function TextCutoutBackground({ textArray }: TextCutoutBackgroundProps) {
  return (
    <Box>
      <Group w={'100%'} justify="flex-end" mb="sm">
        <Text size="lg">I'm allergic to</Text>
      </Group>
      <Stack align="flex-end" gap={'2rem'}>
        {textArray.map((text, index) => (
          <Title
            key={index}
            style={{
              fontSize: '3.5rem',
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
    <>
      <TextCutoutBackground textArray={allergens} />
    </>
  )
}

export default LandingPage
