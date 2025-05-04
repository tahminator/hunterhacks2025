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
import { useRegisterMutation } from '@base/popup/api/auth'
interface RegistrationCardProps {
  close: () => void
}

export function RegisterCard({ close }: RegistrationCardProps) {
  const { mutate } = useRegisterMutation()
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')

  const personIcon = <Box />

  const handleClick = () => {
    mutate({
      username,
      email,
      password,
      firstName,
      lastName,
    })
  }

  return (
    <Stack>
      <Group justify="space-between" mb={'3.3rem'}>
        <Title c={'white'}>Register</Title>
        <ActionIcon color={'olivine.8'} onClick={close}>
          X
        </ActionIcon>
      </Group>
      <TextInput
        value={username}
        label="Username"
        description="Choose a username"
        onChange={(event) => setUsername(event.currentTarget.value)}
        leftSection={personIcon}
        placeholder="Username"
        withAsterisk
      />
      <TextInput
        value={email}
        label="Email"
        description="Enter your email address"
        onChange={(event) => setEmail(event.currentTarget.value)}
        leftSection={personIcon}
        placeholder="Email"
        withAsterisk
      />
      <TextInput
        value={password}
        label="Password"
        type="password"
        description="Create a password (min. 8 characters, 1 lower, 1 upper)"
        onChange={(event) => setPassword(event.currentTarget.value)}
        leftSection={personIcon}
        placeholder="Password"
        withAsterisk
      />
      <Group grow>
        <TextInput
          value={firstName}
          label="First Name"
          onChange={(event) => setFirstName(event.currentTarget.value)}
          placeholder="First Name"
          withAsterisk
        />
        <TextInput
          value={lastName}
          label="Last Name"
          onChange={(event) => setLastName(event.currentTarget.value)}
          placeholder="Last Name"
          withAsterisk
        />
      </Group>
      <Button
        color="olivine"
        disabled={
          username.length < 3 ||
          email.length < 3 ||
          password.length < 8 ||
          firstName.length < 3 ||
          lastName.length < 3
        }
        fullWidth
        onClick={() => handleClick()}
      >
        Register
      </Button>
    </Stack>
  )
}
