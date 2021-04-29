import { deleteFile } from '../firebase/fireStorage'

export const deleteShop = async (malls, mallId, shop_id) => {
    const { id, ...rest } = malls.find(x => x.id === mallId)
    const specificShop = rest.shops.find(x => x.shop_id === shop_id)
    await Promise.all(specificShop.images.map(async img => (
        await deleteFile(img.id)
    )))

    const data = {
        shops: rest.shops.filter(x => x.shop_id !== shop_id)
    }

    return data
}