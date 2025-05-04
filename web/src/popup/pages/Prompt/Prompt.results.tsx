import {
  Box,
  Stack,
  ScrollArea,
  Title,
  Text,
  Group,
  Paper,
  Grid,
} from '@mantine/core'
import styles from './Prompt.module.css'
import { useState } from 'react'

interface ItemReport {
  title: string
  description: string
  severity: string
}

interface ProfileReport {
  name: string
  foods: ItemReport[]
}

export interface AllergyReport {
  message: string
  data: ProfileReport[]
}

function ItemDisplay({ title, description, severity }: ItemReport) {
  return (
    <Paper w={'100%'} radius={'md'} withBorder p={'sm'}>
      <Box>
        <Grid w={'100%'} h={'100%'}>
          <Grid.Col span={8}>
            <Stack>
              <Text fw={'500'}>{title}</Text>
              <Text size="sm" lh={'xs'}>
                {description}
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={4} c={'red'}>
            {/* <Paper bg={'red'} radius={'md md'}> */}
            <Stack>secondline</Stack>
            {/* </Paper> */}
          </Grid.Col>
        </Grid>
      </Box>
    </Paper>
  )
}

export function PromptResults({ message, data }: AllergyReport) {
  const [selectedProfile, setSelectedProfile] = useState(0)

  const profilename = data[selectedProfile].name
  const profileResults = data[selectedProfile].foods

  console.log(message)

  return (
    <Box style={{ overflow: 'hidden' }}>
      <Stack>
        <Stack
          id={styles.resultsHeader}
          pt={'xl'}
          pl={'lg'}
          gap={0}
          h={'120px'}
          aria-label="header"
        >
          <Title fw={'500'} c="white" order={2}>
            So...
          </Title>
          <Title>Can I Eat It?</Title>
        </Stack>
        <Stack gap={'0.2rem'} px={'sm'}>
          <Text size="1rem" fw={'600'}>
            Here's What We Found
          </Text>
          <Group>
            <Text>Showing Results for: </Text>
            {profilename}
          </Group>
        </Stack>
        <ScrollArea px={'sm'} h={'360px'} w={'100%'}>
          <Stack w={'100%'}>
            {profileResults.map((result, index) => {
              return <ItemDisplay {...result} key={index} />
            })}
          </Stack>
        </ScrollArea>
      </Stack>
    </Box>
  )
}
