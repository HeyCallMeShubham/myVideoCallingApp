import React, { useState } from 'react'




type HomePageTypes = {

    name: string,
    roleNumber: number,
    city: string

}



const Home: React.FC<HomePageTypes> = ({ name, roleNumber, city }) => {

    const [value, setValue] = useState<string>("sss"); // type has been assigned to this state so its an implicit state 

    const handleChange = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        try {

            console.log(value, 'value');

        } catch (err) {

            console.log(err, 'err');

        }

    }





    return (

        <div>

            <form onSubmit={handleChange}>

                <input type='text' onChange={(e) => setValue(e.target.value)} />

                <button type='submit'>Button</button>

            </form>



            {value}

            {city}

            {roleNumber}

            {name}

        </div>

    )

}

export default Home