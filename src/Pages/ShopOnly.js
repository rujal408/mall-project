import { Grid, Typography, Button, Fab } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import HOC from '../Components/HOC'
import ShopForm from '../Components/Shop/ShopForm'
import { deleteFile, getFileUrl } from '../firebase/fireStorage'
import { useForm, useFieldArray, FormProvider } from 'react-hook-form'
import { useHistory } from 'react-router'
import { LOCATION_CHANGE } from '../redux/actionType'
import { useDispatch } from 'react-redux'

const defaultData = {
    shops: [{ shop_id: "" + Math.floor(Math.random() * Date.now()), images: [] }]
}

function ShopOnly({ malls, editMode, updateMallData, setEditMode, match }) {

    const methods = useForm({
        defaultValues: {
            shops: [{ shop_name: "", shop_description: "", images: [] }]
        }
    })

    const { handleSubmit, control, reset } = methods

    const { fields, append } = useFieldArray({
        control,
        name: "shops"
    })

    const { id, shop_id } = match.params
    const history = useHistory()
    const dispatch = useDispatch()
    const [data, setData] = useState(defaultData)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (id && shop_id) {
            setEditMode()
            const shop = malls.find(x => x.id === id)?.shops.find(y => y.shop_id === shop_id)
            if (shop) {
                const { shop_id, shop_name, shop_description, images } = shop
                reset({
                    shops: [{ shop_name, shop_description, images: [] }]
                })
                setData({ shops: [{ shop_id, images }] })
            }
        }
    }, [id, malls, shop_id, setEditMode, reset])

    useEffect(() => {
        return () => dispatch({type:LOCATION_CHANGE})
    }, [dispatch])

    const onSubmit = async (datas) => {
        setLoading(true)

        const mainData = {
            shops: data.shops.map((shop, i) => ({ ...shop, shop_name: datas.shops[i].shop_name, shop_description: datas.shops[i].shop_description }))
        }

        const specificMall = malls.find(mall => mall.id === id)

        let finalData = {}

        if (editMode) {
            //state image
            let shopData = mainData.shops[0]
            const stateImage = await getFileUrl(shopData.images)
            const imagesId = stateImage.map(x => x.id)
            //Reducer Image
            const reducerImages = specificMall.shops.find(x => x.shop_id === shop_id).images
            await Promise.all(reducerImages.map(async im => (
                !imagesId.includes(im.id) && await deleteFile(im.id)
            )))
            shopData['images'] = stateImage

            finalData = {

                shops: specificMall.shops.map(shop => shop.shop_id === shop_id ? shopData : shop)
            }

        } else {

            const shopData = await Promise.all(mainData.shops.map(async shop => {
                const images = await getFileUrl(shop.images)
                return { ...shop, images }
            }))
            finalData = {
                shops: [...specificMall.shops, ...shopData]
            }
        }

        updateMallData(id, finalData)
        setLoading(false)
        history.push(`/${id}`)

    }

    const addField = () => {
        append({
            shop_name: "",
            shop_description: "",
            images: []
        })
        setData(da => ({
            shops: [...da.shops, { shop_id: "" + Math.floor(Math.random() * Date.now()), images: [] }]
        }))
    }

    return (
        <Grid container spacing={2}>
            <Grid item sm={12}>
                <Typography variant="h5" component="h5" color="secondary" style={{ textAlign: "center" }}>
                    {editMode ? "Edit" : "Add"} Shop
                </Typography>
            </Grid>
            <Grid item sm={12}>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2} style={{ margin: "auto", width: "40%" }}>
                            <Grid item sm={12}>
                                {
                                    fields.map((field, i) => (
                                        <div key={field.id}>
                                            <ShopForm
                                                setData={setData}
                                                index={i}
                                                data={data.shops[i]}
                                            />
                                        </div>
                                    ))
                                }
                                {!editMode && <Typography variant="h5" color="secondary">
                                    <Fab
                                        color="secondary"
                                        style={{ height: 44, width: 44, margin: 12 }}>
                                        <Add
                                            onClick={addField}
                                        />
                                    </Fab>
                                </Typography>}
                            </Grid>
                            <Grid item sm={12}>
                                <Button
                                    disabled={loading}
                                    variant="contained"
                                    color="secondary"
                                    type="submit">Submit{loading && "ting"}</Button>
                            </Grid>
                        </Grid>
                    </form>
                </FormProvider>
            </Grid>
        </Grid>
    )
}

export default HOC(ShopOnly)
