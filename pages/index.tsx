
import AuthLayout from 'component/backstage/AuthLayout'
import type { ReactElement } from 'react'
import React from 'react'



export default function Page() {
  return {
    /** Your content */
  }
}

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <AuthLayout>
      {/* <NestedLayout>{page}</NestedLayout> */}
      {page}
    </AuthLayout>
  )
}