import PizzaForm from "../../components/admin/PizzaForm"

const NewPizza = () => {
    return (
        <main>
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