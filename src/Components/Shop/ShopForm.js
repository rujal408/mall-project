import React from 'react'
import { Grid, TextField } from '@material-ui/core'
import CancelIcon from '@material-ui/icons/Cancel';
import UploadFile from '../UploadFile';
import { useFormContext, Controller } from 'react-hook-form'

const imageFormat = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

function ShopForm({ data, setData, index }) {

    const { formState: { errors }, control, getValues, clearErrors } = useFormContext()

    const removeFile = async (id) => {

        const fileList = data.images.filter(file => file.id !== id)
        setData(th => ({
            ...th,
            shops: th.shops.map((shop, i) => i === index ? { ...shop, images: fileList } : shop)
        }))
    }

    const handleShopImage = (e) => {
        const imageData = Object.entries(e.target.files).map(([key, value]) => ({ id: key + Math.random() + value.name, image_name: value.name, file: value }))
        setData(th => ({
            ...th,
            shops: th.shops.map((x, i) => (index === i ? { ...x, images: [...x.images, ...imageData] } : x))
        }))

    }

    const shopValidation = (name) => {
        if (errors.shops &&
            errors.shops[index] &&
            errors.shops[index][name]
        ) {
            return errors.shops[index][name].message
        } else {
            return false
        }
    }

    const shopImageValidation = () => {

        if (data.images.length === 0) {
            return "Please Provide Shop Image"
        } else {
            if (data.images.every(im => {
                if (im.hasOwnProperty("url")) {
                    return true
                } else {
                    if (imageFormat.includes(im.file.type)) {
                        return true
                    } else {
                        return false
                    }
                }
            })) {
                clearErrors(`shops[${index}].images`)
                return true
            } else {
                return "One of the image format is not Valid"
            }
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item sm={6}>
                <Controller
                    control={control}
                    name={`shops[${index}].shop_name`}
                    defaultValue={getValues(`shops[${index}].shop_name`)}
                    rules={{
                        required: {
                            value: true,
                            message: "Please Enter Shop Name"
                        },

                    }}
                    render={({
                        field: { value, name, ref, onChange },
                    }) => (
                        <TextField
                            label="Shop Name"
                            variant="filled"
                            onChange={onChange}
                            inputRef={ref}
                            name={name}
                            value={value}
                            error={shopValidation("shop_name") && true}
                            helperText={shopValidation("shop_name")}
                        />
                    )}
                />

            </Grid>
            <Grid item sm={6}>
                <Controller
                    control={control}
                    name={`shops[${index}].shop_description`}
                    defaultValue={getValues(`shops[${index}].shop_description`)}
                    rules={{
                        required: {
                            value: true,
                            message: "Please Enter Shop Description"
                        },

                    }}
                    render={({
                        field: { value, name, ref, onChange },
                    }) => (
                        <TextField
                            label="Shop Description"
                            variant="filled"
                            onChange={onChange}
                            inputRef={ref}
                            name={name}
                            value={value}
                            multiline
                            error={shopValidation("shop_description") && true}
                            helperText={shopValidation("shop_description")}
                        />
                    )}
                />

            </Grid>
            <Grid item sm={12}>
                <Grid item sm={12}>
                    
                    <Controller
                        control={control}
                        name={`shops[${index}].images`}
                        rules={{
                            validate: shopImageValidation
                        }}
                        defaultValue=""
                        render={({
                            field: { value, name, ref, onChange },
                        }) => (
                            <UploadFile
                                ref={ref}
                                label="Shop Images"
                                name={name}
                                value={value}
                                onChange={(e) => { onChange(e); handleShopImage(e) }}
                                message={shopValidation("images")}
                                multiple
                            />
                        )}
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
