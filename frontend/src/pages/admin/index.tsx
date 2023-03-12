import Link from "next/link"

const index = () => {
  return (
    <main className="admin">
        <h2>Admin Dashboard</h2>
        <div className="links">
            <Link href={'/admin/new-pizza'}>
                Create a new pizza
            </Link>
        </div>
    </main>
  )
}

export default index