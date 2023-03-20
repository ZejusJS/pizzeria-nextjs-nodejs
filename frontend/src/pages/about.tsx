const About = () => {
  return (
    <>
      <main>
        <section className='about'>
          <div className='about-container about-what'>
            <h3>Project</h3>
            <p>This is project by <a target={"_blank"} href="https://github.com/ZejusJS">Zejus</a></p>
            <p>Code base <a target={"_blank"} href="https://github.com/ZejusJS/pizzeria-nextjs-nodejs">here</a></p>
            <p>If you want to pay by card, use this number:
              4000007000010006
            </p>
          </div>
          <div className='about-container about-what'>
            <h3>Who are we?</h3>
            <p>We are pizzerias across the whole Czech Republic</p>
          </div>
          <div className='about-container about-place'>
            <h3>Billing adress</h3>
            <p>Mamma Mia s.r.o.</p>
            <p>K Závěrce 2471</p>
            <p>150 00 Praha 5-Smíchov</p>
          </div>
          <div className='about-container about-kontakt'>
            <h3>Contacts</h3>
            <p>Phone number for support: 506 254 675</p>
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