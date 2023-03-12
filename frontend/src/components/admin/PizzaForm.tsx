import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { server } from '../../config/config'
import NProgress from 'nprogress'
import { useRouter } from 'next/router'
import BackSvg from '../../images/Back'

const PizzaForm = ({ pizza }) => {
    let router = useRouter()

    let initialStatePizza = {
        title: pizza?.title ? pizza.title : '',
        price: pizza?.price ? pizza.price : 100,
        currency: 'CZK',
        description: pizza?.description ? pizza.description : '',
        ingredients: pizza?.ingredients ? pizza.ingredients : [],
        image: ''
    }
    // console.log(pizza)
    let initialStateErrors = {
        img: false,
        currency: false,
        invalid: false,
        title: false,
        description: false,
        ingredients: false,
        price: false
    }
    const initialStateImage = { url: '', name: '' }
    const [newPizza, setNewPizza] = useState(initialStatePizza)
    const [image, setImage] = useState(initialStateImage)
    const [errors, setErrors] = useState(initialStateErrors)
    const title = useRef(null)
    const description = useRef(null)
    const ingredients = useRef(null)
    const price = useRef(null)
    const submitBtn = useRef(null)

    useEffect(() => {
        if (router.asPath.includes('new-pizza')) {
            initialStateErrors.title = true
            initialStateErrors.description = true
            initialStateErrors.ingredients = true
        } else {
            setImage({ url: pizza?.images[0].url, name: '' })
        }
        setNewPizza(initialStatePizza)
        setErrors(initialStateErrors)
    }, [pizza])

    function updateForm(e) {
        const name = e.target.name
        const value = e.target.value
        setErrors(prevErr => { return { ...prevErr, invalid: false } })
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
            if (e.target.value < 1) {
                e.target.classList.add('invalid')
                setErrors(prevErr => { return { ...prevErr, [e.target.name]: true } })
            } else {
                e.target.classList.remove('invalid')
                setErrors(prevErr => { return { ...prevErr, [e.target.name]: false } })
            }
            setNewPizza(prevPizza => {
                return { ...prevPizza, [name]: value }
            })
        }
    }

    const imageInp = useRef(null)

    function resetImage(e) {
        imageInp.current.value = ''
        URL.revokeObjectURL(image.url)
        setImage({ url: pizza.images[0].url, name: '' })
        setNewPizza(prevPizza => {
            return { ...prevPizza, image: '' }
        })
    }

    async function sendForm(e) {
        submitBtn.current.disabled = true
        e.preventDefault()

        let isError = false
        for (let value of Object.values(errors)) {
            if (value === true) isError = true
        }
        if (isError) {
            submitBtn.current.disabled = false
            return false
        }
        console.log(newPizza)
        await axios({
            method: router.asPath.includes('new-pizza') ? 'post' : 'put',
            url: router.asPath.includes('new-pizza') ? `/api/admin/new-pizza` : `/api/admin/pizza/${pizza._id}`,
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
                setErrors(initialStateErrors)
                if (router.asPath.includes('edit-pizza')) router.replace(router.asPath, '', { shallow: false })
                else {
                    e.target.reset()
                }
                submitBtn.current.disabled = false
            })
            .catch(e => {
                console.error(e)
                if (e.response?.data?.err === 'img') {
                    setErrors(prevErrs => {
                        return { ...prevErrs, img: true }
                    })
                } else {
                    setErrors(prevErrs => {
                        return { ...prevErrs, img: false }
                    })
                }
                if (e.response?.data?.err === 'invalid') {
                    setErrors(prevErrs => {
                        return { ...prevErrs, invalid: true }
                    })
                } else {
                    setErrors(prevErrs => {
                        return { ...prevErrs, ivalid: false }
                    })
                }
                if (e.response?.status === (401 || 403)) {
                    router.push('/login')
                }
                if (e.response?.status === (400)) {
                    setErrors(prevErrs => {
                        return { ...prevErrs, invalid: true }
                    })
                }
                submitBtn.current.disabled = false
            })
    }


    // console.log(newPizza)
    // console.log(image)
    // console.log(errors)

    return (
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
                    defaultValue={router.asPath.includes('new-pizza') ? '' : pizza?.ingredients.join(', ')}
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
                </select>
            </div>
            <div className='input-container image'>
                <label htmlFor="image" className='img-label'>Upload image</label>
                <input
                    name='image'
                    type="file"
                    id='image'
                    className='img-input'
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => updateForm(e)}
                    ref={imageInp}
                />

                {image.url.length ?
                    <>
                        <label className='pizza-img image-label' htmlFor="image">
                            <img className='pizza-img' loading='lazy' src={image.url} alt="" />
                            <p>{image.name}</p>
                        </label>
                        {
                            router.asPath.includes('edit-pizza') && newPizza.image ?
                                <button
                                    type="button"
                                    className='btn-styled danger delete'
                                    onClick={resetImage}
                                >
                                    <BackSvg />
                                    <span>Back to previous image</span>
                                </button>
                                : ''
                        }
                    </>
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
                {router.asPath.includes('new-pizza') ?
                    'Submit New Pizza' : 'Edit Pizza'}
            </button>
        </form>
    )
}

export default PizzaForm