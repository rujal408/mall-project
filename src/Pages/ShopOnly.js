import { Grid, Typography, Button, Fab } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import HOC from '../Components/HOC'
import ShopForm from '../Components/Shop/ShopForm'
import { deleteFile, getFileUrl } from '../firebase/fireStorage'

const defaultData = {
    shops: [{ shop_id: "" + Math.floor(Math.random() * Date.now()), shop_name: "", shop_description: "", images: [] }]
}

function ShopOnly({ malls, editMode, updateMallData, setEditMode, match }) {

    const { id, shop_id } = match.params
    const [data, setData] = useState(defaultData)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (id && shop_id) {
            setEditMode()
            const shop = malls.find(x => x.id === id)?.shops.find(y => y.shop_id === shop_id)
            if (shop) {
                setData({ shops: [shop] })
            }
        }
    }, [id, malls, shop_id, setEditMode])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const specificMall = malls.find(mall => mall.id === id)

        let finalData = {}

        if (editMode) {
            //state image
            let shopData = data.shops[0]
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

            const shopData = await Promise.all(data.shops.map(async shop => {
                const images = await getFileUrl(shop.images)
                return { ...shop, images }
            }))
            finalData = {
                shops: [...specificMall.shops, ...shopData]
            }
            setData({
                shops: [{
                    shop_id: "" + Math.floor(Math.random() * Date.now()),
                    shop_name: "", shop_description: "", images: []
                }]
            })
        }

        delete finalData.id

        updateMallData(id, finalData)
        setLoading(false)

    }

    return (
        <Grid container spacing={2}>
            <Grid item sm={12}>
                <Typography variant="h5" component="h5" color="secondary" style={{ textAlign: "center" }}>
                    {editMode ? "Edit" : "Add"} Shop
                </Typography>
            </Grid>
            <Grid item sm={12}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} style={{ margin: "auto", width: "40%" }}>
                        <Grid item sm={12}>
                            {data.shops.map((shop, i) => (
                                <ShopForm key={i} setData={setData} data={shop} index={i} />
                            ))}
                            {!editMode && <Typography variant="h5" color="secondary">
                                <Fab
                                    color="secondary"
                                    style={{ height: 44, width: 44, margin: 12 }}>
                                    <Add
                                        onClick={() => setData({
                                            ...data,
                                            shops: [...data.shops, { shop_id: "" + Math.floor(Math.random() * Date.now()), shop_name: "", shop_description: "", images: [] }]
                                        })}
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
            </Grid>
        </Grid>
    )
}

export default HOC(ShopOnly)
