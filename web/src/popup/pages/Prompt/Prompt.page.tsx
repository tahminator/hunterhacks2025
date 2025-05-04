import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Image,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Switch } from '@mantine/core'

import { Allergy, Severity, AllergenProfile } from '@base/types'

import AllergyCard from '@components/AllergyCard'
import AllergyItem from '@components/AllergyItem'

import WaveLgURL from './wave.lg.svg'
import WaveMdURL from './wave.md.svg'
import WaveSmURL from './wave.sm.svg'
import { appHeight } from '@base/theme/theme'
import { Carousel } from '@mantine/carousel'

export function PromptPage() {
  const [resText, setResText] = useState('')
  const [isOnlyUser, setIsOnlyUsers] = useState(true)
  const sampleAllergenProfiles: AllergenProfile[] = [
    {
      profileName: 'John Doe',
      allergies: [
        { name: 'Peanuts', severity: Severity.high },
        { name: 'Milk', severity: Severity.low },
      ],
    },
    {
      profileName: 'Jane Smith',
      allergies: [
        { name: 'Shellfish', severity: Severity.high },
        { name: 'Eggs', severity: Severity.med },
      ],
    },
    {
      profileName: 'Alice Johnson',
      allergies: [
        { name: 'Wheat', severity: Severity.med },
        { name: 'Soy', severity: Severity.low },
      ],
    },
    {
      profileName: 'Mark Lee',
      allergies: [{ name: 'Tree Nuts', severity: Severity.high }],
    },
    {
      profileName: 'Emily Chen',
      allergies: [
        { name: 'Fish', severity: Severity.med },
        { name: 'Sesame', severity: Severity.low },
      ],
    },
  ]

  const profiles: AllergenProfile[] = sampleAllergenProfiles
  const ownerProfile: Allergy[] = [{ name: 'Gluten', severity: Severity.high }]

  return (
    <ScrollArea h={appHeight} pb={'2px'}>
      <Stack>
        <Box h={'150px'} bg={'rgba(0,0,0,1)'} pos={'relative'}>
          {/* <Image></Image> */}
          <Stack
            aria-label="waves"
            gap={'xs'}
            pos={'absolute'}
            bottom={'-14px'}
          >
            <Image src={WaveSmURL} />
            <Image src={WaveMdURL} />
            <Image src={WaveLgURL} />
          </Stack>
        </Box>
        <Stack px={'lg'} py={'sm'} gap={'5px'} w={'100%'}>
          <Title>Restaurant Name</Title>
          First, let us know the name of the restaurant you're eating at.
          <TextInput
            value={resText}
            onChange={(event) => setResText(event.currentTarget.value)}
            withAsterisk
            placeholder="eg. McDonalds"
            variant="filled"
            label="Enter Here"
          />
          <Divider my={'md'} />
          <Title>Profiles</Title>
          <Group>
            <Title order={2}>Checking Just for You?</Title>
            <Switch
              checked={isOnlyUser}
              onChange={(event) => {
                setIsOnlyUsers(event.currentTarget.checked)
              }}
              color={'olivine.6'}
              size="md"
            ></Switch>
            <Text size="sm" hidden={!isOnlyUser}>
              Just making sure, we know you can't eat:
            </Text>
            <Text size="sm" hidden={isOnlyUser}>
              Let's make sure everyone can eat, too.
            </Text>
          </Group>
          <Box w={'100%'} pos={'relative'}>
            <Box hidden={!isOnlyUser}>
              <Stack h={'100%'} w={'95%'} gap={'0'}>
                {ownerProfile.map((allergy: Allergy, index) => {
                  return <AllergyItem key={index} allergy={allergy} />
                })}
              </Stack>
            </Box>
            <Box opacity={isOnlyUser ? 0 : 1} h={isOnlyUser ? 0 : 'auto'}>
              <Carousel withIndicators slideSize="200px" slideGap="xs" loop>
                {profiles.map((profile: AllergenProfile, index) => {
                  return (
                    <Carousel.Slide key={profile.profileName + `${index}`}>
                      <AllergyCard
                        profileName={profile.profileName}
                        allergyList={profile.allergies}
                      />
                    </Carousel.Slide>
                  )
                })}
              </Carousel>
            </Box>
          </Box>
          <Group>
            <Button flex={1} mt={'sm'} color={'olivine'} bottom={'0'} fullWidth>
              Check Allergens
            </Button>
            {/* <ActionIcon /> */}
          </Group>
        </Stack>
      </Stack>
    </ScrollArea>
  )
}

// Wrapper to setup automatic routing on message receipt
export default function PromptWrapper() {
  const navigate = useNavigate()
  const handleMessage = (request: any) => {
    console.log('react received message', request)
    if (request.target === 'check-image') {
      navigate('/prompt')
    }
  }
  useEffect(() => {
    // Do not remove, establishes message passing
    chrome.runtime.sendMessage({ action: 'ping' }).then((res) => {
      console.log(res)
    })
    chrome.runtime.onMessage.addListener(handleMessage)
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [])

  return <></>
}
