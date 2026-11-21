import { redirect } from 'next/navigation'

import { stripe } from '../../lib/stripe'
import { getSessionByserver } from '@/lib/core/Importantfunction'
import { paymentPost } from '@/lib/core/paymentPost'
type SearchParams = { [key: string]: string | string[] | undefined }
export default async function Success({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { session_id } = await searchParams
  const UserSession = await getSessionByserver()
  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const {
    status,
    customer_email,
    payment_intent,
    payment_status,
    metadata,
    amount_total,
    currency,
    line_items,
  } = await stripe.checkout.sessions.retrieve(session_id as string, {
    expand: ['line_items', 'payment_intent']
  })
  console.log(UserSession?.user.email)
  console.log({
    status,
    customer_email,
    payment_intent,
    payment_status,
    metadata
  })

  if (status === 'open') {
    return redirect('/')
  }
//     const res = await paymentPost(session_id as string)
//   console.log(res);

  if (status === 'complete') {
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to{' '}
           If you have any questions, please email{' '}
          <a href="mailto:orders@example.com">orders@example.com</a>.
        </p>
      </section>
    )
  }
}