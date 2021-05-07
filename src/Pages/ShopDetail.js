import React, { useState } from 'react'
import { Typography, Grid, Button } from '@material-ui/core'
import { useHistory } from 'react-router'
import Card from '../Components/Card'
import HOC from '../Components/HOC'
import { deleteFile } from '../firebase/fireStorage'

function ShopDetail({ malls, updateMallData, match }) {
    const { id, shop_id } = match.params
    const history = useHistory()
    const [data, setData] = useState({})

    React.useEffect(() => {
        if (id && shop_id) {
            const mall = malls.find(mall => mall.id === id)
            if (mall) {
                const { id, ...rest } = mall
                setData(rest)
            }
        }
    }, [shop_id, malls, id])

    const deleteImage = async (imageId) => {

        await deleteFile(imageId)
        
        const mall = malls.find(mall => mall.id === id)
        const data = {
            ...mall,
            shops: mall.shops.map(shop => shop.shop_id === shop_id ?
                { ...shop, images: shop.images.filter(img => img.id !== imageId) }
                : shop
            )
        }
        updateMallData(id, data)
    }

    const detail = data?.shops?.find(shop => shop.shop_id === shop_id)

    const adminMode = !match.path.includes("user")

    return (
        <Grid>
            <Grid container spacing={2}>
                <Grid item sm={12} xs={12}>
                    <Typography variant="h4" component="h4" color="primary" style={{ textAlign: "center" }}>
                        {detail?.shop_name}
                    </Typography>
                </Grid>
                <Grid item sm={12} xs={12}>
                    <Typography variant="h5" component="h5" color="primary" style={{ textAlign: "center" }}>
                        {detail?.shop_description}
                    </Typography>
                </Grid>

                <Grid container spacing={2} style={{ margin: "auto", width: "90%" }}>
                    {adminMode && <Grid item sm={12}>
                        <Button
                            onClick={() => history.push('/' + id + '/shop/' + shop_id + '/editShop')}
                            variant="contained"
                            color="secondary">Edit Shop</Button>
                    </Grid>}
                    <Grid item sm={12}>
                        <Grid container spacing={2}>
                            <Grid item sm={12}>
                                <Typography variant="h4" color="primary">Images</Typography>
                            </Grid>
                            {
                                detail?.images
                                    .map(image => (
                                        <Grid item sm={4} xs={12} key={image.id}>
                                            <Card
                                                name={image.image_name}
                                                url={image.url}
                                                crossClick={() => deleteImage(image.id)}
                                                adminMode={adminMode}
                                            />
                                        </Grid>
                                    ))
                            }
                        </Grid>

                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}



export default HOC(ShopDetail)
