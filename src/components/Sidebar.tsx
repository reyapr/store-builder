import React, { PropsWithChildren, ReactElement } from 'react';
import Link from "next/link"

const MENU = [
  {
    id: 2,
    name: 'Stores',
    path: '/stores'
  },
  {
    id: 3,
    name: 'Products',
    path: '/products'
  },
  {
    id: 4,
    name: 'Orders',
    path: '/orders'
  },
  {
    id: 5,
    name: 'Categories',
    path: '/categories'
  }
]

export default function Sidebar({ children } : PropsWithChildren) {
  return (
    <div style={{ display: 'flex'}}>
      <div style={{ flex: 1, borderWidth: '1px'}}>
        {
          MENU.map((item) => (
            <div key={item.id}>
              <Link href={item.path}>{item.name}</Link>
            </div>
          ))
        }
      </div>
      <main style={{ flex: 11, borderWidth: '1px'}}>
        {children}
      </main>
    </div>
  )
}