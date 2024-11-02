'use client'

import React, { useEffect, useState } from 'react'

import { Flex } from '@chakra-ui/react'

import { Layout } from '@/components'
import { createClient } from '@/utils/supabase/client'

export default function HomeDashboard() {
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    const supabase = createClient()
    const fetchUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      setUser(user)
    }

    console.log({ user })

    fetchUser()
  }, [user])

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Setting', path: '/dashboard/settings' }
  ]

  return (
    <Layout breadcrumbs={breadcrumbs} isAdmin={false}>
      <Flex
        style={{
          display: 'flex',
          flex: 11,
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        Ini halaman setting
      </Flex>
    </Layout>
  )
}
