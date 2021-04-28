import { Grid, Typography, Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import HOC from '../Components/HOC'
import ShopForm from '../Components/Shop/ShopForm'
import { deleteFile, getFileUrl } from '../firebase/fireStorage'

const defaultData = {
    shops: [{ shop_name: "", shop_description: "", images: [] }]
}

function ShopOnly({ malls, editMode, updateMallData, setEditMode }) {

    const { id, shop_name } = useParams()
    const [data, setData] = useState(defaultData)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (id && shop_name) {
            setEditMode()
            const shop = malls.find(x => x.id === id)?.shops.find(y => y.shop_name === shop_name)
            if (shop) {
                setData({ shops: [shop] })
            }
        }
    }, [id, malls, shop_name, setEditMode])

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
            const reducerImages = specificMall.shops.find(x => x.shop_name === shop_name).images
            await Promise.all(reducerImages.map(async im => (
                !imagesId.includes(im.id) && await deleteFile(im.id)
            )))
            shopData['images'] = stateImage

            finalData = {
                ...specificMall,
                shops: specificMall.shops.map(shop => shop.shop_name === shop_name ? shopData : shop)
            }

        } else {

            const shopData = await Promise.all(data.shops.map(async shop => {
                const images = await getFileUrl(shop.images)
                return { ...shop, images }
            }))
            finalData = {
                ...specificMall,
                shops: [...specificMall.shops, ...shopData]
            }
            setData(defaultData)
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
                            <ShopForm setData={setData} data={data.shops[0]} />
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
