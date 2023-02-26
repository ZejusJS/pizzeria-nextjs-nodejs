import { server } from '../../config/config'

import Login from '../../components/auth/Login'

const login = ({ user, setUser, setCart }) => {

  return (
    <main>
      <Login
      user={user}
      setUser={setUser}
      setCart={setCart}
      />
    </main>
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