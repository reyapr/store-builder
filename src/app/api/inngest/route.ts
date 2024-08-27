import { serve } from 'inngest/next'
import { inngest } from '@/inngest/client'
import { sendEmail } from '@/inngest/email'

export const config = {
  runtime: 'edge',
}


export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    sendEmail, 
  ],
});