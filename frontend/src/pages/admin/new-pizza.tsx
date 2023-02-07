import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { server } from '../../config/config'
import NProgress from 'nprogress'
import { useRouter } from 'next/router'

const NewPizza = () => {
    const initialStatePizza = {
        title: '',
        price: 100,
        currency: 'CZK',
        description: '',
        ingredients: [],
        image: ''
    }
    const initialStateImage = { url: '', name: '' }
    const [newPizza, setNewPizza] = useState(initialStatePizza)
    const [image, setImage] = useState(initialStateImage)
    const [errors, setErrors] = useState({
        img: false,
        currency: false,
        invalid: false,
        title: true,
        description: true,
        ingredients: true,
        price: false
    })
    const title = useRef(null)
    const description = useRef(null)
    const ingredients = useRef(null)
    const price = useRef(null)
    const submitBtn = useRef(null)

    let router = useRouter()

    function updateForm(e) {
        const name = e.target.name
        const value = e.target.value
        if (name === 'ingredients') {
            let ingrs = value.split(',').map(ingr => ingr.trim())
            if (ingrs[0].length < 1) {
                ingredients.current.classList.add('invalid')
                setErrors(prevErr => { return { ...prevErr, ingredients: true } })
            }
            else if (ingrs[0].length >= 1) {
                ingredients.current.classList.remove('invalid')
                setErrors(prevErr => { return { ...prevErr, ingredients: false } })
            }
            setNewPizza(prevPizza => {
                return { ...prevPizza, [name]: ingrs }
            })
        } else if (name === 'image') {
            let file = e.target.files[0]
            if (file) {
                setNewPizza(prevPizza => {
                    return { ...prevPizza, [name]: file }
                })
                const url = URL.createObjectURL(file)
                const img = new Image()
                img.src = url
                img.onload = function () {
                    setImage(prevImg => {
                        return { url: img.src, name: file.name }
                    })
                }
                setErrors(prevErr => { return { ...prevErr, img: false } })
            }
        } else {
            setErrors(prevErr => { return { ...prevErr, invalid: false } })
            if (value.length < 1 && name === 'price') {
                price.current.classList.add('invalid')
                setErrors(prevErr => { return { ...prevErr, price: true } })
            }
            else if (value.length >= 1 && name === 'price') {
                price.current.classList.remove('invalid')
                setErrors(prevErr => { return { ...prevErr, price: false } })
            }
            else if (value.length < 1 && name === 'title') {
                title.current.classList.add('invalid')
                setErrors(prevErr => { return { ...prevErr, title: true } })
            }
            else if (value.length >= 1 && name === 'title') {
                title.current.classList.remove('invalid')
                setErrors(prevErr => { return { ...prevErr, title: false } })
            }
            else if (value.length < 1 && name === 'description') {
                description.current.classList.add('invalid')
                setErrors(prevErr => { return { ...prevErr, description: true } })
            }
            else if (value.length >= 1 && name === 'description') {
                description.current.classList.remove('invalid')
                setErrors(prevErr => { return { ...prevErr, description: false } })
            }
            setNewPizza(prevPizza => {
                return { ...prevPizza, [name]: value }
            })
        }
    }

    async function sendForm(e) {
        submitBtn.current.disabled = true
        e.preventDefault()

        let isError = false
        for (let value of Object.values(errors)) {
            if (value === true) isError = true
        }
        if (isError || !newPizza.image) {
            submitBtn.current.disabled = false
            return false
        }

        await axios({
            method: 'post',
            url: `${server}/admin/new-pizza`,
            withCredentials: true,
            data: newPizza,
            headers: {
                "Content-Type": "multipart/form-data",
                'Access-Control-Allow-Origin': `${server}`,
            },
            onUploadProgress: function (progressEvent) {
                e.target.classList.add('btn-cart-loading')
                NProgress.start()
            },
            onDownloadProgress: function (progressEvent) {
                e.target.classList.remove('btn-cart-loading')
                NProgress.done(false)
            },
        })
            .then(res => {
                console.log(res)
                setNewPizza(initialStatePizza)
                setImage(initialStateImage)
                e.target.reset();
            })
            .catch(e => {
                console.log(e)
                if (e.response.data.err === 'img') {
                    setErrors(prevErrs => {
                        return { ...prevErrs, img: true }
                    })
                    submitBtn.current.disabled = false
                } else {
                    setErrors(prevErrs => {
                        return { ...prevErrs, img: false }
                    })
                    submitBtn.current.disabled = false
                }
                if (e.response.data.err === 'invalid') {
                    setErrors(prevErrs => {
                        return { ...prevErrs, invalid: true }
                    })
                    submitBtn.current.disabled = false
                } else {
                    setErrors(prevErrs => {
                        return { ...prevErrs, ivalid: false }
                    })
                    submitBtn.current.disabled = false
                }
                if (e.response.status === 401 || 403) {
                    router.push('/login')
                }
            })
    }

    return (
        <main>
            <form className='form form-newpizza' onSubmit={(e) => sendForm(e)}>
                <div className='input-container'>
                    <label htmlFor="title">Title</label>
                    <input
                        ref={title}
                        type="text"
                        placeholder='Title'
                        name='title'
                        id='title'
                        className='title'
                        value={newPizza.title}
                        onChange={(e) => updateForm(e)}
                    />
                </div>
                <div className='input-container'>
                    <label htmlFor="description">Description</label>
                    <textarea
                        ref={description}
                        name="description"
                        id="description"
                        className='description'
                        onChange={(e) => updateForm(e)}
                        value={newPizza.description}
                    ></textarea>
                </div>
                <div className='input-container'>
                    <label htmlFor="ingredients">Ingredients</label>
                    <textarea
                        ref={ingredients}
                        name="ingredients"
                        id="ingredients"
                        className='ingredients'
                        onChange={(e) => updateForm(e)}
                    ></textarea>
                </div>
                <div className='price-continer'>
                    <input
                        ref={price}
                        type="number"
                        placeholder='Price'
                        name='price'
                        id='price'
                        className='price'
                        value={newPizza.price}
                        onChange={(e) => updateForm(e)}
                    />
                    <select
                        name='currency'
                        id='currency'
                        className='currency'
                        value={newPizza.currency}
                        onChange={(e) => updateForm(e)}
                    >
                        <option value='CZK'>CZK</option>
                        <option value='EUR'>EUR</option>
                        <option value='USD'>USD</option>
                    </select>
                </div>
                <div className='input-container'>
                    <label htmlFor="image" className='img-label'>Upload image</label>
                    <input
                        name='image'
                        type="file"
                        id='image'
                        className='img-input'
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={(e) => updateForm(e)}
                    />

                    {image.url.length ?
                        <label className='pizza-img' htmlFor="image">
                            <img className='pizza-img' loading='lazy' src={image.url} alt="" />
                            <p>{image.name}</p>
                        </label>
                        : ''
                    }
                </div>
                <div className='errors'>
                    {
                        errors.img ?
                            <p>Please <b>upload an image</b> with size less than <b>10MB.</b></p>
                            :
                            ''
                    }
                    {
                        errors.invalid ?
                            <p>Some fields are <b>invalid</b> or <b>empty</b></p>
                            :
                            ''
                    }
                </div>
                <button
                    ref={submitBtn}
                    type="submit"
                    className='submit'>
                    Submit New Pizza
                </button>
            </form>
        </main>
    )
}

export const getServerSideProps = async (context) => {
    return {
        props: {
            '1': 1
        }
    }
}

export default NewPizza