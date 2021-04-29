import React, { useState } from 'react'
import { Fab, Grid, TextField, Typography, Button, Avatar } from '@material-ui/core'
import { Add } from '@material-ui/icons';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import ShopForm from '../Shop/ShopForm';
import { addMallData, getMallData, updateMallData } from '../../redux/actions/mall';
import UploadFile from '../UploadFile';
import { deleteFile, getFileUrl } from '../../firebase/fireStorage';
import { useParams } from 'react-router';
import { EDIT_MALL, LOCATION_CHANGE } from '../../redux/actionType'

const defaultData = {
    mall_name: "",
    mall_address: "",
    mall_image: null,
    shops: [{ shop_id: "" + Math.floor(Math.random() * Date.now()), shop_name: "", shop_description: "", images: [] }]
}

function MallForm() {

    const dispatch = useDispatch()
    const { editMode, malls } = useSelector(state => state.mallReducer, shallowEqual)
    const { id } = useParams()
    const [data, setData] = useState(defaultData)
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)

    const handleData = (e) => setData(th => ({ ...th, ...{ [e.target.name]: e.target.value } }))

    React.useEffect(() => {
        if (id) {
            dispatch({ type: EDIT_MALL })
            const mall = malls.find(x => x.id === id)
            if (mall) {
                setData(mall)
                setImageUrl(mall.mall_image.url)
            }
        }
    }, [id, dispatch, malls])

    React.useEffect(() => {
        dispatch(getMallData())
        return () => dispatch({ type: LOCATION_CHANGE })
    }, [dispatch])

    const handleImage = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setImageUrl(reader.result)
            }
        }
        reader.readAsDataURL(e.target.files[0])

        const imageData = Object.entries(e.target.files).map(([key, value]) => (
            { id: key + Math.random() + value.name, image_name: value.name, file: value }
        ))
        setData(th => ({ ...th, mall_image: imageData }))
    }


    const handleSubmit = async (e) => {
        e.preventDefault()


        setLoading(true)

        if (editMode) {
            const mall = malls.find(x => x.id === id)

            if (mall.mall_image.id !== data.mall_image.id) {
                await deleteFile(mall.mall_image.id)
            }
            const mall_image = await getFileUrl([data.mall_image])
            const shops = await Promise.all(data.shops.map(async (shop, i) => {
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
                ...data, mall_image: mall_image[0], shops
            }
            delete datas.id
            dispatch(updateMallData(id, datas))
        } else {
            const mall_image = await getFileUrl(data.mall_image)
            const shops = await Promise.all(data.shops.map(async shop => {
                const images = await getFileUrl(shop.images)
                return { ...shop, images }
            }))
            const datas = {
                ...data, mall_image: mall_image[0], shops
            }
            dispatch(addMallData(datas))
            setData({
                mall_name: "",
                mall_address: "",
                mall_image: null,
                shops: [{ shop_id: "" + Math.floor(Math.random() * Date.now()), shop_name: "", shop_description: "", images: [] }]
            })
            setImageUrl('')
        }
        setLoading(false)
    }

    return (
        <Grid container spacing={2}>
            <Grid item sm={12}>
                <Typography variant="h5" component="h5" color="secondary" style={{ textAlign: "center" }}>
                    {editMode ? "Edit" : "Add"} Mall
                </Typography>
            </Grid>
            <form onSubmit={handleSubmit}>
                <Grid container
                    spacing={2}
                    style={{ width: "40%", margin: "auto" }}
                >
                    <Grid item sm={6}>
                        <TextField
                            name="mall_name"
                            variant="filled"
                            label="Enter Name"
                            fullWidth
                            onChange={handleData}
                            value={data.mall_name}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <TextField
                            name="mall_address"
                            variant="filled"
                            label="Enter Address"
                            fullWidth
                            onChange={handleData}
                            value={data.mall_address}

                        />
                    </Grid>
                    <Grid item sm={12}>

                        <UploadFile
                            name="mall_image"
                            onChange={handleImage}
                            label="Mall Image"
                        />
                        {imageUrl &&
                            <Avatar
                                src={imageUrl}
                                style={{ height: "122px", width: "122px", marginTop: "8px" }}
                            />}

                    </Grid>
                    <Grid item sm={12}>
                        {
                            data.shops.map((f, i) => (
                                <div key={i}>
                                    {i === 0 && <h1>Shops</h1>}
                                    <ShopForm setData={setData} index={i} data={f} />
                                </div>
                            ))
                        }
                        <Typography variant="h5" color="secondary">
                            <Fab
                                color="secondary"
                                style={{ height: 44, width: 44, margin: 12 }}>
                                <Add
                                    onClick={() => setData({
                                        ...data,
                                        shops: [...data.shops,
                                        { shop_id: "" + Math.floor(Math.random() * Date.now()), shop_name: "", shop_description: "", images: [] }]
                                    })}
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

        </Grid>
    )
}

export default MallForm
