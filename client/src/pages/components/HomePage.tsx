import React from 'react'
import Footer from '../../components/Footer'
import Pollaroide from '../../components/Pollaroide'

const HomePage = () => {
    return (
        <>
            <section>
                {/* Section gauche */}
                <div>
                    Ici c'est le Bla Bla
                    <h1>Hello world</h1>
                </div>
                <div>
                    Les 2 boutons sign in et sign up
                </div>
            </section>
            <section>
                {/*Section droite*/}
                <div>
                    <Pollaroide username="John Doe" userImage="/images/users/hehe.png" recipeName="Carbonara" recipeImage="/images/recipes/Carbonara.png" />
                    Photos des recette en pollaroide en carrousselle
                </div>
            </section>
            < Footer />
        </>
    )
}

export default HomePage