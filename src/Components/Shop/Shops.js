import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom'
import Card from '../Card'
import { deleteShop } from '../../utils/deleteShop'

function Shops({ shops, malls, updateMallData }) {
    
    const history = useHistory()

    const handleShopDelete = async (mallId, shopName) => {
        const data = await deleteShop(malls, mallId, shopName)
        if (data) {
            updateMallData(mallId, data)
        }
    }

    return (
        <Grid>
            <Typography variant="h4" color="secondary">Shops</Typography>

            <Grid container spacing={2}>
                {
                    shops.slice(0, 3).map((x) => {
                        if (x.shop.length > 0) {
                            return <Grid item sm={4} xs={12} key={x?.shop[0]?.shop_name}>
                                <Card
                                    name={x?.shop[0]?.shop_name}
                                    url={x?.shop[0]?.images[0]?.url}
                                    description={x?.mall_name}
                                    handleClick={() => history.push(`/${x?.id}/shop/${x?.shop[0]?.shop_name}`)}
                                    crossClick={() => handleShopDelete(x?.id, x?.shop[0]?.shop_name)}
                                />
                            </Grid>
                        } else {
                            return null
                        }

                    })
                }

            </Grid>
            {shops.length >= 3 && <Link to="/shops" className="link">View All</Link>}
        </Grid>
    )
}

export default Shops
