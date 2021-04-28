import { deleteFile } from '../firebase/fireStorage'

export const deleteShop = async (malls, mallId, shopName) => {
    const { id, ...rest } = malls.find(x => x.id === mallId)
    const specificShop = rest.shops.find(x => x.shop_name === shopName)
    await Promise.all(specificShop.images.map(async img => (
        await deleteFile(img.id)
    )))

    const data = {
        ...rest,
        shops: rest.shops.filter(x => x.shop_name !== shopName)
    }

    return data
}