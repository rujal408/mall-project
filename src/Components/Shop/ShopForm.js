import React from 'react'
import { Grid, TextField } from '@material-ui/core'
import CancelIcon from '@material-ui/icons/Cancel';
import UploadFile from '../UploadFile';

function ShopForm({ data, setData, index = 0 }) {


    const removeFile = async (id) => {

        const fileList = data.images.filter(file => file.id !== id)
        setData(th => ({
            ...th,
            shops: th.shops.map((shop, i) => i === index ? { ...shop, images: fileList } : shop)
        }))
    }

    const getShopData = (e) => setData(th => ({
        ...th,
        shops: th.shops.map((shop, i) => i === index ? { ...shop, ...{ [e.target.name]: e.target.value } } : shop)
    }))

    const handleShopImage = (e) => {
        const imageData = Object.entries(e.target.files).map(([key, value]) => ({ id: key + Math.random()+value.name, image_name: value.name, file: value }))
        setData(th => ({
            ...th,
            shops: th.shops.map((x, i) => (index === i ? { ...x, images: [...x.images, ...imageData] } : x))
        }))

    }


    return (
        <Grid container spacing={2}>
            <Grid item sm={6}>
                <TextField
                    name="shop_name"
                    label="Shop Name"
                    variant="filled"
                    onChange={getShopData}
                    value={data.shop_name}
                />
            </Grid>
            <Grid item sm={6}>
                <TextField
                    name="shop_description"
                    label="Shop Description"
                    variant="filled"
                    onChange={getShopData}
                    value={data.shop_description}
                />
            </Grid>
            <Grid item sm={12}>
                <Grid item sm={12}>
                    <UploadFile
                        name="shop_images"
                        multiple
                        onChange={handleShopImage}
                        label="Shop Images"
                    />

                    <p>First Image will be Thumbline</p>
                    {data.images.map((image) => (
                        <div key={image.id}>
                            <CancelIcon onClick={() => removeFile(image.id)} /> {image.image_name}
                        </div>
                    ))}

                </Grid>
            </Grid>
        </Grid>
    )
}

export default ShopForm
