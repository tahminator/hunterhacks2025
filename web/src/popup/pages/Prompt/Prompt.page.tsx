import { Box, Group, Image, Stack, Text, Title } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Switch } from '@mantine/core'

import WaveLgURL from './wave.lg.svg'
import WaveMdURL from './wave.md.svg'
import WaveSmURL from './wave.sm.svg'

export function PromptPage() {
  const [isOnlyUser, setIsOnlyUsers] = useState(true)
  return (
    <Stack>
      <Box h={'150px'} bg={'rgba(0,0,0,1)'} pos={'relative'}>
        {/* <Image></Image> */}
        <Stack aria-label="waves" gap={'xs'} pos={'absolute'} bottom={'-14px'}>
          <Image src={WaveSmURL} />
          <Image src={WaveMdURL} />
          <Image src={WaveLgURL} />
        </Stack>
      </Box>
      <Stack pl={'lg'} py={'sm'} gap={'5px'}>
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
            Let's make everyone can eat, too.
          </Text>
        </Group>
      </Stack>
    </Stack>
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
