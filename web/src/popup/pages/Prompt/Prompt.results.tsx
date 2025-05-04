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

function LevelDisplay({ severity }: { severity: string }) {
  const getCircles = () => {
    switch (severity) {
      case 'low':
        return [1, 0, 0]
      case 'med':
        return [2, 2, 0]
      case 'high':
        return [3, 3, 3]
      default:
        return [0, 0, 0]
    }
  }

  const colorMapping = ['gray.5', '#dbcf9c', 'orange.7', 'red.9']

  return (
    <Group gap={'5px'}>
      {Array.from({ length: 3 }, (_, idx) => {
        return (
          <Box
            style={{ borderRadius: '10px' }}
            w={'13px'}
            h={'13px'}
            key={'idx'}
            bg={colorMapping[getCircles()[idx]]}
          />
        )
      })}
    </Group>
  )
}

function ItemDisplay({ title, description, severity }: ItemReport) {
  const getLabel = () => {
    switch (severity) {
      case 'low':
        return 'Likely'
      case 'med':
        return 'Caution'
      case 'high':
        return 'No Way'
      default:
        return 'Err.'
    }
  }
  return (
    <Paper w={'100%'} radius={'md'} withBorder>
      <Box>
        <Grid w={'100%'} h={'100%'}>
          <Grid.Col span={8}>
            <Stack pl={'sm'} py={'sm'}>
              <Text fw={'500'}>{title}</Text>
              <Text size="sm" lh={'xs'}>
                {description}
              </Text>
            </Stack>
          </Grid.Col>
          <Grid.Col span={4}>
            <Stack
              w={'100%'}
              h={'100%'}
              bg={'black'}
              justify="center"
              align="center"
              gap={'7px'}
              style={{ borderRadius: '0px 10px 10px 0px' }}
            >
              <Text fw={'600'} c={'white'}>
                {getLabel()}
              </Text>
              <LevelDisplay severity={severity} />
            </Stack>
          </Grid.Col>
        </Grid>
      </Box>
    </Paper>
  )
}

export function PromptResults({ message, data }: AllergyReport) {
  // const [selectedProfile, setSelectedProfile] = useState(0)
  const [selectedProfile, _] = useState(0)

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
        <ScrollArea scrollbars="y" px={'sm'} h={'360px'} w={'100%'}>
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
