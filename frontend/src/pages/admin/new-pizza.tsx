import PizzaForm from "../../components/admin/PizzaForm"

const NewPizza = () => {
    return (
        <main>
            <h1 className="text-cen">Add a New Pizza</h1>
            <PizzaForm pizza={{}} />
        </main>
    )
}

// export const getServerSideProps = async (context) => {
//     return {
//         props: {
//             '1': 1
//         }
//     }
// }

// export async function getStaticProps(context) {
//     return {
//         props: {},
//     }
// }

export default NewPizza