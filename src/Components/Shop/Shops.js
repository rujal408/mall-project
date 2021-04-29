import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom'
import Card from '../Card'
import { deleteShop } from '../../utils/deleteShop'

function Shops({ shops, malls, updateMallData, adminMode }) {
    
    const history = useHistory()
    const handleShopDelete = async (mallId, shop_id) => {
        const data = await deleteShop(malls, mallId, shop_id)
        if (data) {
            updateMallData(mallId, data)
        }
    }

    const locationChange = (id, shopId) => {
        if (!adminMode) {
            history.push(`/${id}/shop/${shopId}/user`)
        } else {
            history.push(`/${id}/shop/${shopId}`)
        }
    }
    return (
        <Grid>
            <Typography variant="h4" color="secondary">Shops</Typography>

            <Grid container spacing={2}>
                {
                    shops.slice(0, 3).map((x) => {
                        if (x.shop.length > 0) {
                            return <Grid item sm={4} xs={12} key={x?.shop[0]?.shop_id}>
                                <Card
                                    name={x?.shop[0]?.shop_name}
                                    url={x?.shop[0]?.images[0]?.url}
                                    description={x?.mall_name}
                                    handleClick={() => locationChange(x?.id, x?.shop[0]?.shop_id)}
                                    crossClick={() => handleShopDelete(x?.id, x?.shop[0]?.shop_id)}
                                    adminMode={adminMode}
                                />
                            </Grid>
                        } else {
                            return null
                        }

                    })
                }

            </Grid>
            {shops.length >= 3 && <Link to={!adminMode ? "/shops/user" : "/shops"} className="link">View All</Link>}
        </Grid>
    )
}

export default Shops
