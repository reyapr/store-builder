'use client'

import React from 'react'

import {
  Button,
  Box,
  Text,
  Grid,
  GridItem,
  Divider,
  Heading
} from '@chakra-ui/react'
import groupBy from 'lodash/groupBy'

import { getSchedules } from '@/app/dashboard/schedules/actions'
import { Layout, CardProduct } from '@/components'
import { ISchedule } from '@/interfaces'

export default function Store() {
  const { data: schedules, isFetching, error } = getSchedules()

  const groupByDate = (schedules: ISchedule.ISchedule[]) => {
    return groupBy(schedules, 'date')
  }

  const breadcrumbs = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Toko', path: '/dashboard/stores' }
  ]

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      isFetching={isFetching}
      error={error as Error}
      rightHeaderComponent={
        <Button colorScheme="blue" size="sm" onClick={() => {}}>
          Create Store
        </Button>
      }
    >
      {schedules && (
        <>
          {Object.entries(groupByDate(schedules)).map(
            ([date, scheduleGroup]) => (
              <Box key={date} p={4} borderWidth="1px" borderRadius="md" mb={4}>
                <Heading as="h3" size="lg">
                  Tanggal Jadwal: {new Date(date).toLocaleDateString()}
                </Heading>
                <Divider my={4} />
                <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                  {scheduleGroup.map((schedule) => (
                    <GridItem
                      key={schedule.id}
                      bg="gray.100"
                      p={3}
                      borderRadius="md"
                    >
                      {schedule.products.length > 0 ? (
                        <>
                          <Text fontSize="lg" fontWeight="bold">
                            Produk:
                          </Text>
                          <Grid templateColumns="1fr 2fr">
                            {schedule.products.map((product) => (
                              <GridItem key={product.id} p={2}>
                                <CardProduct product={product.product} />
                              </GridItem>
                            ))}
                          </Grid>
                        </>
                      ) : (
                        <Text fontSize="lg">
                          Tidak ada produk tersedia untuk jadwal ini
                        </Text>
                      )}
                    </GridItem>
                  ))}
                </Grid>
              </Box>
            )
          )}
        </>
      )}
    </Layout>
  )
}
