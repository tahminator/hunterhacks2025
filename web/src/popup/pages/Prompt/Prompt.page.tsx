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
  Modal,
  Checkbox,
  LoadingOverlay,
} from '@mantine/core'
import { useContext, useEffect, useMemo, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import { Switch } from '@mantine/core'
import { Allergy, Severity, AllergenProfile } from '@base/types'

import { useDisclosure } from '@mantine/hooks'

import AllergyCard from '@components/AllergyCard'
import AllergyItem from '@components/AllergyItem'

import WaveLgURL from './wave.lg.svg'
import WaveMdURL from './wave.md.svg'
import WaveSmURL from './wave.sm.svg'
import { appHeight } from '@base/theme/theme'
import { Carousel } from '@mantine/carousel'
import { ImageContext } from '@base/popup/contexts/ImageContext'
import { useReportMutation } from '@base/popup/api/report'

export function PromptPage() {
  const { snapshotData } = useContext(ImageContext)
  const [resText, setResText] = useState('')
  const [opened, { open, close }] = useDisclosure(false)
  const [isOnlyUser, setIsOnlyUsers] = useState(true)
  const {
    mutate: generateReport,
    data: report,
    isPending: reportIsLoading,
  } = useReportMutation()

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

  const snapshotImage = useMemo(() => {
    console.log('Snapshot', snapshotData)
    if (!snapshotData) {
      return <Image color="black"></Image>
    }
    return (
      <Image w={'100%'} h={'100%'} src={snapshotData} alt="" fit="contain" />
    )
  }, [snapshotData])

  const profiles: AllergenProfile[] = sampleAllergenProfiles
  const ownerProfile: Allergy[] = [{ name: 'Gluten', severity: Severity.high }]

  if (report && !reportIsLoading) {
    return <PromptResults report={report} />
  }

  return (
    <Box style={{ overflow: 'hidden' }}>
      <LoadingOverlay visible={reportIsLoading} />
      <ScrollArea h={appHeight} pb={'2px'}>
        <Stack>
          <Box h={'150px'} bg={'rgba(0,0,0,1)'} pos={'relative'}>
            <Box w={'100%'} h={'152px'}>
              {snapshotImage}
            </Box>
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
            <Group
              gap={'xs'}
              justify="center"
              align="center"
              mt={'sm'}
              px={'sm'}
            >
              <Button
                onClick={() =>
                  generateReport({
                    restaurantName: resText,
                    image: snapshotData,
                  })
                }
                flex={1}
                color={'olivine'}
                fullWidth
                disabled={resText.length < 4}
              >
                Check Allergens
              </Button>
              <Box hidden={isOnlyUser}>
                <ActionIcon onClick={open} color={'gray.8'} size={'lg'}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-users-plus"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                    <path d="M3 21v-2a4 4 0 0 1 4 -4h4c.96 0 1.84 .338 2.53 .901" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    <path d="M16 19h6" />
                    <path d="M19 16v6" />
                  </svg>
                </ActionIcon>
              </Box>
            </Group>
          </Stack>
        </Stack>
      </ScrollArea>
      <Modal
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        opened={opened}
        onClose={close}
        title="Include Profiles"
      >
        <Stack>
          {profiles.map((profile, index) => {
            return (
              <Checkbox
                key={index}
                checked={true}
                label={profile.profileName}
              />
            )
          })}
          <Button onClick={close} color="black">
            Done
          </Button>
        </Stack>
      </Modal>
    </Box>
  )
}

// Wrapper to setup automatic routing on message receipt
export default function PromptWrapper() {
  const { setSnapshotData } = useContext(ImageContext)
  // const navigate = useNavigate()
  const handleMessage = (request: any) => {
    if (request.target === 'check-image') {
      console.log('react received message', request)

      const { dataUrl, x, y, w, h } = request.data
      const image = new window.Image() as HTMLImageElement
      image.src = dataUrl
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          throw new Error('Could not load image.')
        }
        ctx.drawImage(image, x, y, w, h, 0, 0, w, h)
        const croppedUrl = canvas.toDataURL('image/png')
        setSnapshotData(croppedUrl as string)
      }
    }
  }
  useEffect(() => {
    // Do not remove, establishes message passing
    chrome.runtime.sendMessage({ action: 'TEST_USER' }).then((res) => {
      console.log('ping', res)
    })
    chrome.runtime.onMessage.addListener(handleMessage)
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [])

  return <Box></Box>
}
