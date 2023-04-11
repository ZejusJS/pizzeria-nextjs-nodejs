// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log(req.query)
    res.redirect(`/user/profile/orders?payId=${req?.query?.payId}&reload=true`)
  } catch (e) {
    console.error(e)
    res.redirect('/user/profile/orders')
  }
}
