import {
  Stack,
  Box,
  Group,
  Title,
  ActionIcon,
  TextInput,
  Button,
} from '@mantine/core'
import { useState } from 'react'
import styles from './Login.module.css'
import { useLoginMutation } from '@base/popup/api/auth'

interface LoginCardProps {
  close: () => void
}

export function LoginCard({ close }: LoginCardProps) {
  const { mutate } = useLoginMutation()
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const personIcon = <Box />

  const handleClick = () => {
    mutate({ username, password })
  }

  return (
    <Stack>
      <Group justify="space-between" mb={'3rem'}>
        <Title c={'white'}>Login</Title>
        <ActionIcon color={'olivine.8'} onClick={close}>
          X
        </ActionIcon>
      </Group>
      <TextInput
        value={username}
        label="Username"
        description="Enter your username"
        onChange={(event) => setUsername(event.currentTarget.value)}
        leftSection={personIcon}
        placeholder="Username"
        withAsterisk
      />
      <TextInput
        value={password}
        label="Password"
        description="Enter your password"
        onChange={(event) => setPassword(event.currentTarget.value)}
        leftSection={personIcon}
        placeholder="Password"
        withAsterisk
      />
      <Button
        color="olivine"
        disabled={!username || !password}
        fullWidth
        onClick={() => handleClick()}
      >
        Login
      </Button>
    </Stack>
  )
}
