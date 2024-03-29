import Link from "next/link"

const index = () => {
  return (
    <main className="admin">
      <h2>Admin Dashboard</h2>
      <div className="links">
        <div>
          <Link href={'/admin/new-pizza'}>
            Create a new pizza
          </Link>
        </div>
        <div>
          <Link href={'/admin/orders'}>
            Orders
          </Link>
        </div>
        <div>
          <Link href={'/admin/deleted-pizzas'}>
            Deleted pizzas
          </Link>
        </div>
      </div>
    </main>
  )
}

export const getServerSideProps = async (ctx) => {
  return {
    props: {
      
    }
  }
}

export default index