import React, { useState, useEffect } from 'react'
import { Fab, Grid, TextField, Typography, Button, Avatar } from '@material-ui/core'
import { Add } from '@material-ui/icons';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import ShopForm from '../Shop/ShopForm';
import { addMallData, getMallData, updateMallData } from '../../redux/actions/mall';
import UploadFile from '../UploadFile';
import { deleteFile, getFileUrl } from '../../firebase/fireStorage';
import { useHistory, useParams } from 'react-router';
import { EDIT_MALL, LOCATION_CHANGE } from '../../redux/actionType'
import { useForm, useFieldArray, FormProvider, Controller } from 'react-hook-form'

const imageFormat = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

function MallForm() {

    const methods = useForm({
        defaultValues: {
            mall_name: "",
            mall_address: "",
            mall_image: '',
            shops: [{
                shop_name: "",
                shop_description: "",
                images: []
            }]
        }
    })
    const { handleSubmit, formState: { errors }, control, reset, clearErrors } = methods

    const { fields, append } = useFieldArray({
        control,
        name: "shops"
    })

    const dispatch = useDispatch()
    const history = useHistory()
    const { editMode, malls } = useSelector(state => state.mallReducer, shallowEqual)
    const { id } = useParams()
    const [data, setData] = useState({
        mall_image: null,
        shops: [{ shop_id: "" + Math.floor(Math.random() * Date.now()), images: [] }]
    })
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)


    useEffect(() => {
        if (id) {
            dispatch({ type: EDIT_MALL })
            const mall = malls.find(x => x.id === id)
            if (mall) {
                setData(
                    {
                        mall_image: mall.mall_image,
                        shops: mall.shops.map(shop => ({ shop_id: shop.shop_id, images: shop.images }))
                    }
                )
                reset({
                    mall_name: mall.mall_name,
                    mall_address: mall.mall_address,
                    mall_image: '',
                    shops: mall.shops.map(shop => ({
                        shop_name: shop.shop_name,
                        shop_description: shop.shop_description,
                        images: []
                    }))
                })
                setImageUrl(mall.mall_image.url)
            }
        }
    }, [id, dispatch, malls, reset])

    useEffect(() => {
        dispatch(getMallData())
        return () => dispatch({ type: LOCATION_CHANGE })
    }, [dispatch])


    const handleImage = (e) => {
        const file = e.target.files
        if (file[0]) {
            const reader = new FileReader();
            reader.readAsDataURL(file[0])
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImageUrl(reader.result)
                }
            }
            const imageData = Object.entries(file).map(([key, value]) => (
                { id: key + Math.random() + value.name, image_name: value.name, file: value }
            ))
            setData(th => ({ ...th, mall_image: imageData[0] }))
        }

    }


    const submitData = async (datas) => {

        const finalData = {
            ...datas,
            mall_image: data.mall_image,
            shops: data.shops.map((shop, i) => ({ ...shop, shop_name: datas.shops[i].shop_name, shop_description: datas.shops[i].shop_description }))
        }


        setLoading(true)

        if (editMode) {
            const mall = malls.find(x => x.id === id)

            if (mall.mall_image.id !== finalData.mall_image.id) {
                await deleteFile(mall.mall_image.id)
            }
            const mall_image = await getFileUrl([finalData.mall_image])
            const shops = await Promise.all(finalData.shops.map(async (shop, i) => {
                const specificShop = mall.shops.find(s => s.shop_name === shop.shop_name)
                if (specificShop) {
                    await Promise.all(specificShop.images.map(async (img, j) => (
                        !shop.images.map(x => x.id).includes(img.id) && await deleteFile(img.id)
                    )))
                }

                const images = await getFileUrl(shop.images)
                return { ...shop, images }
            }))
            const datas = {
                ...finalData, mall_image: mall_image[0], shops
            }
            dispatch(updateMallData(id, datas))
        } else {
            const mall_image = await getFileUrl([finalData.mall_image])
            const shops = await Promise.all(finalData.shops.map(async shop => {
                const images = await getFileUrl(shop.images)
                return { ...shop, images }
            }))
            const datas = {
                ...finalData, mall_image: mall_image[0], shops
            }
            dispatch(addMallData(datas))

            setImageUrl('')
        }
        setLoading(false)
        history.push('/dashboard')
    }

    const addField = () => {
        append({
            shop_name: "",
            shop_description: "",
            images: []
        })
        setData(da => ({
            ...da,
            shops: [...da.shops, { shop_id: "" + Math.floor(Math.random() * Date.now()), images: [] }]
        }))
    }

    const mallImageValidation = () => {
        if (!data.mall_image) {
            return "Please Provide Mall Image"
        } else {
            if (data.mall_image.hasOwnProperty("url")) {
                return true
            } else {
                if (!imageFormat.includes(data.mall_image.file.type)) {
                    return "Provide Valid Image Format"
                } else {
                    clearErrors("mall_image")
                    return true
                }
            }

        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item sm={12}>
                <Typography variant="h5" component="h5" color="secondary" style={{ textAlign: "center" }}>
                    {editMode ? "Edit" : "Add"} Mall
                </Typography>
            </Grid>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(submitData)}>
                    <Grid container
                        spacing={2}
                        style={{ width: "40%", margin: "auto" }}
                    >
                        <Grid item sm={6}>
                            <Controller
                                control={control}
                                name="mall_name"
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Please Enter Mall Name"
                                    },

                                }}
                                defaultValue=""
                                render={({
                                    field: { value, name, ref, onChange },
                                }) => (
                                    <TextField
                                        onChange={onChange}
                                        label="Enter Mall Name"
                                        variant="filled"
                                        inputRef={ref}
                                        name={name}
                                        value={value}
                                        error={errors?.mall_name && true}
                                        helperText={errors?.mall_name?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item sm={6}>
                            <Controller
                                control={control}
                                name="mall_address"
                                rules={{
                                    required: {
                                        value: true,
                                        message: "Please Enter Mall Address"
                                    },

                                }}
                                defaultValue=""
                                render={({
                                    field: { value, name, ref, onChange },
                                }) => (
                                    <TextField
                                        onChange={onChange}
                                        inputRef={ref}
                                        name={name}
                                        value={value}
                                        variant="filled"
                                        label="Enter Mall Address"
                                        error={errors?.mall_address && true}
                                        helperText={errors?.mall_address?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item sm={12}>

                            <Controller
                                control={control}
                                name="mall_image"
                                rules={{
                                    validate: mallImageValidation
                                }}
                                render={({
                                    field: { value, name, ref, onChange },
                                }) => (
                                    <UploadFile
                                        ref={ref}
                                        label="Mall Image"
                                        name={name}
                                        value={value}
                                        onChange={(e) => { onChange(e); handleImage(e) }}
                                        message={errors?.mall_image?.message}
                                    />
                                )}
                            />
                            {imageUrl &&
                                <Avatar
                                    src={imageUrl}
                                    style={{ height: "122px", width: "122px", marginTop: "8px" }}
                                />}

                        </Grid>
                        <Grid item sm={12}>
                            {
                                fields.map((field, i) => (
                                    <div key={field.id}>
                                        {i === 0 && <h1>Shops</h1>}
                                        <ShopForm
                                            setData={setData}
                                            index={i}
                                            data={data.shops[i]}
                                        />
                                    </div>
                                ))
                            }
                            <Typography variant="h5" color="secondary">
                                <Fab
                                    color="secondary"
                                    style={{ height: 44, width: 44, margin: 12 }}>
                                    <Add
                                        onClick={addField}
                                    />
                                </Fab>
                            </Typography>
                        </Grid>
                        <Grid item sm={12}>
                            <Button
                                disabled={loading}
                                type="submit"
                                variant="contained"
                                color="primary">
                                Submit{loading && "ting..."}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </FormProvider>


        </Grid>
    )
}

export default MallForm
