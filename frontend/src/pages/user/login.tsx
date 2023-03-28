import { server } from '../../config/config'

import Login from '../../components/auth/Login'
import Meta from '../../components/Meta'

const login = ({ }) => {

  return (
    <>
    <Meta title='Mamma Mia | Login' />
      <main>
        <Login
        />
      </main>
    </>
  )
}

// export const getServerSideProps = async (context) => {
//   return {
//     props: {
//       '1': 1
//     }
//   }
// }


// export async function getStaticProps(context) {
//   return {
//     props: {}, 
//   }
// }

export default login