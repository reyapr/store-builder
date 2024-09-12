'use client'

import React from 'react'

import { Box, Container, Heading } from '@chakra-ui/react'

import UserForm from '@/components/admin/users/Form'
import { ICreateUserRequest } from '@/interfaces/user'

const AddUserPage: React.FC = () => {
  const initialValues = {
    name: '',
    email: '',
    password: '',
    role: ''
  }

  const handleSubmit = (values: ICreateUserRequest, { setSubmitting }: any) => {
    // Handle form submission here (e.g., API call to create user)
    console.log('Adding user:', values)
    setSubmitting(false)
  }

  return (
    <Container maxW="container.xl" mt={8}>
      <Box>
        <Heading as="h1" size="xl" mb={4}>
          Add User
        </Heading>
        <UserForm initialValues={initialValues} onCreate={handleSubmit} />
      </Box>
    </Container>
  )
}

export default AddUserPage
