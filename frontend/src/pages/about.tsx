const About = () => {
  return (
    <>
      <main>
        <section className='about'>
          <div className='about-container about-what'>
            <h3>Who are we?</h3>
            <p>We are pizzerias across the whole Czech Republic</p>
          </div>
          <div className='about-container about-place'>
            <h3>Where to find us?</h3>
            <p>K Závěrce 2471</p>
            <p>150 00 Praha 5-Smíchov</p>
          </div>
          <div className='about-container about-kontakt'>
            <h3>Contacts</h3>
            <p>Phone number: 506 254 675</p>
            <p>Email: contact@mamma.mia</p>
          </div>
        </section>
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


export default About