import { Grid, TextField, Typography } from '@material-ui/core'
import React from 'react'
import { useHistory } from 'react-router'
import Card from '../Components/Card'
import HOC from '../Components/HOC'
import { paginate, Pagination } from '../utils/Paginate'
import { deleteShop } from '../utils/deleteShop'

function ShopList({ malls, updateMallData, match }) {

    const [search, setSearch] = React.useState('')
    const [currentPage, setPage] = React.useState(1)
    const [postPerPage, setPostPerPage] = React.useState(6)
    const history = useHistory()
    const shops = malls.map(mall => mall.shops.map(x => ({ ...x, id: mall.id, mall_name: mall.mall_name }))).flat()

    const handleChange = (e) => {
        setPage(1)
        const value = e.target.value
        setSearch(value)
    }

    const handleShopDelete = async (mallId, shopName) => {
        const data = await deleteShop(malls, mallId, shopName)
        if (data) {
            updateMallData(mallId, data)
        }
    }

        const filteredShops = shops.filter(shop => search === "" ? shop
            :
            shop.shop_name.toLowerCase().includes(search.toLowerCase()))

        const adminMode = !match.path.includes("user")

        return (

            <Grid container spacing={2} style={{ width: "90%", margin: "auto" }}>
                <Grid item sm={12} md={12} style={{ textAlign: 'center' }}>
                    <TextField
                        name="search"
                        label="Search"
                        variant="filled"
                        onChange={handleChange}
                        style={{ width: "35%" }}
                    />
                </Grid>

                <Grid container spacing={2}>
                    <Grid item sm={12}>
                        <Typography variant="h4" color="secondary">Shops</Typography>
                    </Grid>
                    {
                        paginate(filteredShops, postPerPage, currentPage)
                            .map(shop => (
                                <Grid item sm={4} xs={12} key={shop.shop_id}>
                                    <Card
                                        name={shop.shop_name}
                                        url={shop.images[0].url}
                                        description={shop.mall_name}
                                        handleClick={() => history.push('/' + shop.id + '/shop/' + shop.shop_id)}
                                        crossClick={() => handleShopDelete(shop.id, shop.shop_id)}
                                        adminMode={adminMode}
                                    />
                                </Grid>
                            ))
                    }
                </Grid>
                <Grid container spacing={2}>
                    <Grid item sm={12}>
                        <Pagination
                            postPerPage={postPerPage}
                            totalPosts={shops.length}
                            paginate={(number) => setPage(number)}
                            setPostPerPage={(e) => { setPostPerPage(+e.target.value); setPage(1) }}
                        />
                    </Grid>
                </Grid>
            </Grid>


        )
    }


    export default HOC(ShopList)
